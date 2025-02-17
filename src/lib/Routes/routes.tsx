
import React, { ReactNode } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteObject } from 'react-router-dom';
import _404 from '@/pages/Error/404';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { LayoutType, RouteType } from '@/types/route';
import { Middleware, RoleMiddleware } from './middlewares';




export const WithLayout: React.FC<{Component:ReactNode | null, layout?:LayoutType}> = ({Component, layout}) => {
	if (layout === 'main') return <MainLayout>{Component}</MainLayout>
	if (layout === 'public') return <PublicLayout>{Component}</PublicLayout>
	if (layout === 'auth') return <>{Component}</>
	if (layout === 'error') return <>{Component}</>
	return <>{Component}</>
};

export const sanatizedRoutes = (routes: RouteType[]) => {
	const preparedRoutes: RouteObject[] = routes.map((route: RouteType) => {
		return {
			path: route.path,
			element: <Middleware middlewares={route.middlewares || []}>
				<RoleMiddleware users={route.users}>
					<WithLayout Component={route.component} layout={route.layout} />
				</RoleMiddleware>
			</Middleware>,
			children: sanatizedRoutes(route.children || [])
		}
	})
	return preparedRoutes;
}




