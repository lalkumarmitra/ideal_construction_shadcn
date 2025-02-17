import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useAppSelector } from '@/redux/hooks'
import React from 'react'
import { Link } from 'react-router-dom';

const BreadcrumbNav: React.FC = () => {
    const breadcrumbData = useAppSelector(state=>state.ui.breadCrumb);
    const page = breadcrumbData.find(bc=>bc.type ==='page');
    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {breadcrumbData.map((bc,i)=>bc.type !== 'page' &&(
                    <React.Fragment key={i}>
                        <BreadcrumbItem key={i}>
                            <BreadcrumbLink asChild>
                                <Link to={bc.link || '/'}>{bc.label}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </React.Fragment>
                ))}
                {page?(
                    <BreadcrumbItem>
                        <BreadcrumbPage>{page.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                ):null}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbNav