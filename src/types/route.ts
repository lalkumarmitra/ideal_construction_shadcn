
export type MiddleWareType = 'auth' | 'admin' | 'guest' | 'public';
export type LayoutType = 'main' | 'public' | 'auth' | 'error';
export type RouteType = {
	isMenu: boolean,
	icon?: React.FC<{ className?: string }>,
	label?: string,
	path: string,
	component:React.ReactNode | null, 
	middlewares?: MiddleWareType[],
	users?: string[],
	layout?: LayoutType,
	children?: RouteType[]
	defaultParameters?:string[]
}