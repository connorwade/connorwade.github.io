---
title: "Go and Vite Together"
description: "A quick guide to using Vite as a frontend for your Go API"
pubDate: "March 24 2024"
draft: true
---

Are you one of the other five people on this planet who also happen to use Vite and Go without Echo, Gorilla, or Gin? Are you interested in the prospect of using them together? Well hold on to your undershirts while we go on a fun little adventure of using them together.

## The Motivation

If you haven't seen Pocketbase, it is a brilliant little project that I think most engineers would be jealous of. It does one job and it does it well. Whenever I'm looking for inspiration for my own Go code, I often read through its code to better understand how to structure code.

One thing I really like as a pretty good JavaScript developer, is the use of Vite as the provider for the UI. I don't really like the way Templ or templates or HTMX feels with Go so this was a promising alternative to what is sadly becoming the status quo.

## The setup

### The API Package

The first step on our heretical journey is to create a basic HTTP server within Go. There's a lot of thought out there about how a Go project should be setup and I generally just like having packages setup by function. So first thing you will need is an `api` package.

```
mkdir api
```

Within the `api` package, let's create a very simple server with Go.

```go
// api/server.go
package api

import (
	"fmt"
	"log"
	"net/http"
)

type Server struct {
	*http.Server
}

func NewServer(port string) *Server {
	s := &Server{
		&http.Server{
			Addr: port,
		},
	}

	s.Handler = s.setRoutes()

	return s
}

func (s *Server) Start() {
	fmt.Printf("Server running on http://localhost%s\n", s.Addr)
	if err := s.ListenAndServe(); err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}

func (s *Server) setRoutes() *http.ServeMux {
	router := http.NewServeMux()

	v1 := http.NewServeMux()
	v1.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Hello World"))
	})
	router.Handle("/v1/", http.StripPrefix("/v1", v1))

	return router
}

```

Now, let's write our `main.go` file.

```go
// main.go
package main

import "yourmod/api"

func main() {
	server := api.NewServer(":8080")
	server.Start()
}
```

Running this code with `go run .` should yield an API that gives us a status code of 200 when we visit `localhost:8080/health`.

### The UI Package

Once you confirm your Go project is functioning we need a UI package. Let's do that by running the `create` command from your Node package manager of choice:

```bash
#Run from the root of your project
pnpm create vite@latest ui
```

You'll go through the whole Vite setup process. For my project, I chose Svelte, but you are free to do whatever you want. (It doesn't matter for this.)

Go into the project, install the dependencies, and then build the project right away.

```
cd ui && pnpm i && pnpm build
```

For 99% of Vite templates, this gives you a "dist" folder that contains the build of your project you are meant to deploy to a hosting service. (Or embed in Go as we are about to see.)

**Side note:** You may want to consider if you're going to be developing this project with other people, you may want to add the build command to the "prepare" NPM script. This way, a "dist" folder always will always exist. You won't get a message from someone confused why they can't get the UI to work even though they installed Vite and ran it in dev mode.

Now let's do the Go part of this package. Add a file called `embed.go` and open it.

```go
// ui/embed.go
package ui

import (
	"embed"
)

//go:embed all:dist
var Dist embed.FS
```

Using this method, we can create an embeddable file system from a directory so that we can serve it over HTTP.

_Tangent:_ I don't really understand why the embed package works as a comment instead of a function. I understand that it is the compiler being told, "Hey, here's some files I need for you to break down to bytes and store within the program." But I guess I just don't see why that isn't a function? I don't know, I'm sure the real answer is "Compilers are hard and engineering is harder. Also we work at Google, you don't think we couldn't figure out a function if it could be a function?"

### Putting them together

To serve a file system we have to handle it in a special way from the rest of our program.

Let's go back to our router setup and tell it how to handle these embedded files.

```go
// api/server.go
// ...

func (s *Server) setRoutes() *http.ServeMux {
	router := http.NewServeMux()

	v1 := http.NewServeMux()
	v1.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Hello World"))
	})
	router.Handle("/v1/", http.StripPrefix("/v1", v1))

	distFileServer := http.FileServer(http.FS(ui.Dist))
	router.Handle("/", distFileServer)

	return router
}

// ...
```

Well, it looks like it'll work. But unfortunately this fails. If you start the server again and go to the site in a browser, you will see just a white page with a single link: "/dist". And if you click on it, you will be taken to "/dist", but nothing will be working. If you check the console, you'll see that there are errors retrieving the CSS and JavaScript. More importantly though, you probably don't want to be serving your UI on an endpoint called "dist" anyways.

So let's fix this problem by using Echo. Though we aren't actually going to install it.

## Copy and Paste Engineering

If we look at PocketBase's `embed.go` file on Github, we can see that there's an extra line they use to properly serve the "dist" folder.

```go
//...
// DistDirFS contains the embedded dist directory files (without the "dist" prefix)
var DistDirFS = echo.MustSubFS(distDir, "dist")
//...
```

However, unfortunately for us, they are using Echo as a server. We have only the vanilla functions that Google has decided to bless us with.

But I said to myself, "How hard could it really be to implement what Echo does in this function?" Turns out, not hard at all. It's so easy in fact, that it can be copied and pasted without modification.

If we open Echo's FS file on Github, we can see that it is honestly pretty free of abstractions: https://github.com/labstack/echo/blob/master/echo_fs.go#L104. We want to steal MustSubFS. Now the first thing you should do before stealing code, is to check that the license allows you to do so. Echo is using the MIT license, so we are free to use the code however we want.

Okay, so we find the `MustSubFS` function:

```go
func MustSubFS(currentFs fs.FS, fsRoot string) fs.FS {
	subFs, err := subFS(currentFs, fsRoot)
	if err != nil {
		panic(fmt.Errorf("can not create sub FS, invalid root given, err: %w", err))
	}
	return subFs
}
```

If you copy that over, you will need the `subFS` function that is within this function:

```go
func subFS(currentFs fs.FS, root string) (fs.FS, error) {
	root = filepath.ToSlash(filepath.Clean(root))
	if dFS, ok := currentFs.(*defaultFS); ok {
		if !filepath.IsAbs(root) {
			root = filepath.Join(dFS.prefix, root)
		}
		return &defaultFS{
			prefix: root,
			fs:     os.DirFS(root),
		}, nil
	}
	return fs.Sub(currentFs, root)
}
```

And if you copy that, you will need the `defaultFS` structure:

```go
type defaultFS struct {
	prefix string
	fs     fs.FS
}
```

And if you copy that, you will need the `Open` function since Go requires an FS object to have an "Open" method.

```go
func (fs defaultFS) Open(name string) (fs.File, error) {
	if fs.fs == nil {
		return os.Open(name)
	}
	return fs.fs.Open(name)
}
```

But now we can modify our `embed.go` project with the code we have pilfered from the hard working Open Source community. (Have I mentioned that Echo is great package and you should look at it if you don't want to use vanilla Go?)

Credit to the two contributors who worked on this code:
https://github.com/aldas
https://github.com/zeek0x

Now we can modify our own embed code:

```go
// ui/embed.go
package ui

import (
	"embed"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
)

//go:embed all:dist
var dist embed.FS

var DistDirFs = MustSubFS(dist, "dist")

type defaultFS struct {
	prefix string
	fs     fs.FS
}

func MustSubFS(currentFs fs.FS, fsRoot string) fs.FS {
	subFs, err := subFS(currentFs, fsRoot)
	if err != nil {
		panic(fmt.Errorf("can not create sub FS, invalid root given, err: %w", err))
	}
	return subFs
}

func subFS(currentFs fs.FS, root string) (fs.FS, error) {
	root = filepath.ToSlash(filepath.Clean(root))
	if dFS, ok := currentFs.(*defaultFS); ok {
		if !filepath.IsAbs(root) {
			root = filepath.Join(dFS.prefix, root)
		}
		return &defaultFS{
			prefix: root,
			fs:     os.DirFS(root),
		}, nil
	}
	return fs.Sub(currentFs, root)
}

func (fs defaultFS) Open(name string) (fs.File, error) {
	if fs.fs == nil {
		return os.Open(name)
	}
	return fs.fs.Open(name)
}
```

In the words of ole' papa Linus: "You have copied that ... without understanding why it does what it does, and as a result your code IS GARBAGE." So, let's make sure that we understand what we just put into our project.

The `MustSubFS` function is simple enough to understand: it just checks to unsure that `subFS` works. If it fails, the system panics. In this case, that is pretty acceptable as not being able to embed a vital package is a pretty big deal. Should `panic` be used is really the only question within that function. Typically panics are used when you want to traverse out of a callstack to a top-level function and then attempt to recover the error. In this context it doesn't make sense as we aren't using recursion or anything. It'd be safe to replace this with a `log.Fatalf`.

The `SubFS` function is where most of the interesting stuff is happening in this code. It takes your embedded files and a string of the root. It normalizes and cleans the string. Then it does something that might be a little bit more difficult to understand. It checks to see if the embed you gave it has the type of the `defaultFS`. However, we aren't actually using that... So then we can actually prune this code quite a bit by erasing all the stuff related to the `defaultFS`.

```go
package ui

import (
	"embed"
	"fmt"
	"io/fs"
	"path/filepath"
)

//go:embed all:dist
var dist embed.FS

var DistDirFs = MustSubFS(dist, "dist")

func MustSubFS(currentFs fs.FS, fsRoot string) fs.FS {
	subFs, err := subFS(currentFs, fsRoot)
	if err != nil {
		log.Fatalf("can not create sub FS, invalid root given, err: %v", err)
	}
	return subFs
}

func subFS(currentFs fs.FS, root string) (fs.FS, error) {
	root = filepath.ToSlash(filepath.Clean(root))
	return fs.Sub(currentFs, root)
}
```

All that's left to understand is how `fs.Sub` works. And actually it's very simple, it returns a new embedded file object of a directories children.

Hmm...

Yeah we could've just done:

```go
//go:embed all:dist
var dist embed.FS

func Dist() (fs.FS, error) {
	return fs.Sub(dist, "dist")
}
```

Although I personally like the abstraction from the former, so let's stick with that.

Turns out the problem really was just not knowing that Go already provides a way for us to do what we wanted to do from the very beginning.

### Modifying the router

Now, let's finish this project up with a simple modification to our router:

```go
// api/server.go
//...

func (s *Server) setRoutes() *http.ServeMux {
	router := http.NewServeMux()

	v1 := http.NewServeMux()
	v1.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Hello World"))
	})
	router.Handle("/v1/", http.StripPrefix("/v1", v1))

	distFileServer := http.FileServer(http.FS(ui.DistDirFs))
	router.Handle("/", distFileServer)

	return router
}

//...
```

Now our project should serve the UI files from the root of the URL.

From this point, you may want to go ahead and use a client-side router for your app so that you don't have to go through the pain of managing it on the Go side.

However, now you have a UI with all the strengths (and downsides) of Vite. Personally, I think it makes my frontend development experience with Go so much better than working with the server-side alternatives.
