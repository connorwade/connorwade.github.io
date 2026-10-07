<script lang="ts">
	import Badge from '$lib/components/ui/badge.svelte';
	import Range from '$lib/components/ui/range.svelte';
	import { Axis, Chart, Highlight, Layer, Rule, Spline, Tooltip } from 'layerchart';
	import { scaleLinear } from 'd3-scale';
	import Card from '$lib/components/ui/card.svelte';

	// Parameters
	interface ShotParameters {
		grindSize: number;
		doseGrams: number;
		yieldGrams: number;
	}

	// CONSTRAINTS
	interface MachineConstraints {
		maxBasketCapacityGrams: number;
		maxPumpTimeSeconds: number;
	}

	// Outcome
	interface ShotOutcome {
		style: 'Ristretto' | 'Standard Espresso' | 'Lungo' | 'Choked / Invalid';
		extractionYieldPercent: number;
		body: 'Heavy & Syrupy' | 'Medium' | 'Light & Tea-like';
		primaryFlavorNote: 'Bright & Fruity' | 'Balanced Sweetness' | 'Dark & Bitter' | 'Astringent';
	}

	let params: ShotParameters = $state({
		grindSize: 3,
		doseGrams: 18,
		yieldGrams: 36
	});

	const constrainsts = {
		maxBasketCapacityGrams: 20,
		maxPumpTimeSeconds: 40
	};

	let flowRate = $derived(Math.round(params.grindSize * 1.2)); // Coarser = faster flow
	let shotTimeSeconds = $derived(Math.round(params.yieldGrams / flowRate));

	let brewRatio = $derived(params.yieldGrams / params.doseGrams); // e.g., 1:1, 1:2, 1:3

	function EvaluateEspressoSpace(
		params: ShotParameters,
		constraints: MachineConstraints
	): ShotOutcome {
		// 1. HARD CONSTRAINTS (Fails)
		if (params.doseGrams > constraints.maxBasketCapacityGrams) {
			return {
				style: 'Choked / Invalid',
				extractionYieldPercent: 0,
				body: 'Heavy & Syrupy',
				primaryFlavorNote: 'Astringent'
			};
		}

		if (shotTimeSeconds > constraints.maxPumpTimeSeconds) {
			return {
				style: 'Choked / Invalid',
				extractionYieldPercent: 0,
				body: 'Heavy & Syrupy',
				primaryFlavorNote: 'Astringent'
			};
		}

		// Short, intense shots (Ristretto)
		if (brewRatio < 1.5) {
			return {
				style: 'Ristretto',
				extractionYieldPercent: 16,
				body: 'Heavy & Syrupy',
				primaryFlavorNote: 'Bright & Fruity'
			};
		}

		// Traditional balanced shots
		if (brewRatio >= 1.5 && brewRatio <= 2.2) {
			return {
				style: 'Standard Espresso',
				extractionYieldPercent: 20,
				body: 'Medium',
				primaryFlavorNote: 'Balanced Sweetness'
			};
		}

		// Stretched, high-yield shots (Lungo)
		return {
			style: 'Lungo',
			extractionYieldPercent: 24,
			body: 'Light & Tea-like',
			primaryFlavorNote: 'Dark & Bitter'
		};
	}

	let espressoShot = $derived(EvaluateEspressoSpace(params, constrainsts));

	// Series data across grind size settings (1 through 16)
	interface ChartDataPoint {
		grindSize: number;
		flowRate: number;
		shotTimeSeconds: number;
	}

	let seriesData: ChartDataPoint[] = $derived(
		Array.from({ length: 16 }, (_, i) => {
			const grind = i + 1;
			const flow = Math.round(grind * 1.2);
			const time = Math.round(params.yieldGrams / flow);
			return {
				grindSize: grind,
				flowRate: flow,
				shotTimeSeconds: time
			};
		})
	);
</script>

<div class="space-y-6">
	<div class="space-y-4">
		<Range bind:value={params.grindSize} min={1} max={16}>Grind Setting: {params.grindSize}</Range>
		<Range bind:value={params.doseGrams} min={10} max={25}>Dose Grams: {params.doseGrams}g</Range>
		<Range bind:value={params.yieldGrams} min={15} max={60}>Yield Grams: {params.yieldGrams}g</Range
		>
	</div>

	<div class="flex flex-wrap gap-2">
		<Badge variant="primary">Flow Rate: {flowRate} g/s</Badge>
		<Badge variant="accent">Shot Time: {shotTimeSeconds}s</Badge>
		<Badge>Output Ratio: {brewRatio.toFixed(1)}:1</Badge>
	</div>

	<div class="relative h-[300px] w-full rounded-md border border-border bg-surface p-4">
		<Chart
			data={seriesData}
			x="grindSize"
			y="flowRate"
			yDomain={[0, null]}
			yNice
			y1="shotTimeSeconds"
			y1Range={({ yScale }) => yScale.domain()}
			padding={{ top: 24, bottom: 24, left: 36, right: 36 }}
			tooltipContext={{ mode: 'quadtree-x' }}
			height={300}
		>
			{#snippet children({ context })}
				<Layer>
					<Axis
						placement="left"
						rule
						format="metric"
						label="↑ flow rate (g/s)"
						labelPlacement="start"
						labelProps={{ class: 'fill-primary font-mono text-xs' }}
					/>
					<Axis
						placement="right"
						scale={scaleLinear(context.y1Scale?.domain() ?? [], [context.height, 0])}
						ticks={context.y1Scale?.ticks?.()}
						rule
						label="shot time (s) ↑"
						labelPlacement="start"
						labelProps={{ class: 'fill-secondary font-mono text-xs' }}
					/>
					<Axis placement="bottom" format="none" rule />
					<Spline class="stroke-primary stroke-2" />
					<Spline
						y={(d: ChartDataPoint) => context.y1Scale?.(d.shotTimeSeconds)}
						class="stroke-secondary stroke-2"
					/>
					<Highlight
						lines
						points
						onPointClick={(_, { data }) => {
							if (data?.grindSize) params.grindSize = data.grindSize;
						}}
					/>
					<Highlight
						points={{ class: 'fill-secondary' }}
						y={(d: ChartDataPoint) => context.y1Scale?.(d.shotTimeSeconds)}
						onPointClick={(_, { data }) => {
							if (data?.grindSize) params.grindSize = data.grindSize;
						}}
					/>

					<!-- Active params.grindSize indicator -->
					<Rule x={params.grindSize} class="stroke-muted-foreground/60 [stroke-dasharray:4_4]" />
					{#if context.xScale && context.yScale && context.y1Scale}
						<circle
							cx={context.xScale(params.grindSize)}
							cy={context.yScale(flowRate)}
							r={5}
							class="fill-primary stroke-background stroke-2"
						/>
						<circle
							cx={context.xScale(params.grindSize)}
							cy={context.yScale(context.y1Scale(shotTimeSeconds))}
							r={5}
							class="fill-secondary stroke-background stroke-2"
						/>
					{/if}
				</Layer>

				<Tooltip.Root
					{context}
					variant="none"
					classes={{
						container:
							'rounded border border-border bg-surface p-2.5 font-mono text-xs text-foreground shadow-brutal-sm backdrop-blur-sm'
					}}
				>
					{#snippet children({ data })}
						<Tooltip.Header class="border-b border-border/30 pb-1.5 font-bold text-foreground">
							Grind Setting: {data.grindSize}
						</Tooltip.Header>
						<Tooltip.List>
							<Tooltip.Item
								label="Flow Rate"
								value={`${data.flowRate} g/s`}
								color="var(--color-primary)"
							/>
							<Tooltip.Item
								label="Shot Time"
								value={`${data.shotTimeSeconds}s`}
								color="var(--color-secondary)"
							/>
						</Tooltip.List>
					{/snippet}
				</Tooltip.Root>
			{/snippet}
		</Chart>
	</div>

	<Card class="p-4">
		Outcomes:
		<Badge>Body: {espressoShot.body}</Badge>
		<Badge>Flavor: {espressoShot.primaryFlavorNote}</Badge>
		<Badge>Style: {espressoShot.style}</Badge>
		<Badge>Extraction Yield: {espressoShot.extractionYieldPercent}%</Badge>
	</Card>
</div>
