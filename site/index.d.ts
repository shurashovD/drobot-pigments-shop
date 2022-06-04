import { FC, SVGProps } from "react"

declare module '*.svg' {
    export const ReactComponent: FC<
		SVGProps<SVGSVGElement> & { title?: string }
	>

	const src: string
	export default src
}