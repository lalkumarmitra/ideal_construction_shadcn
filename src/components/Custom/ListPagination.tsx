import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export const ListPagination = ({ 
    last_page, 
    current_page, 
    url_end_point,
    onPageChange
}: { 
    last_page: number, 
    current_page: number, 
    url_end_point: string,
    onPageChange?:(page:number)=>void
}) => {
    const maxPagesToShow = 5; // Limit number of pages displayed at once
    const pageNumbers: (number | string)[] = [];
    const navigate = useNavigate();

    // Scroll to top when current_page changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Use "auto" instead of "smooth" for instant scrolling
        });
    }, [current_page]);

    // Generate pagination numbers dynamically
    if (last_page <= maxPagesToShow) {
        for (let i = 1; i <= last_page; i++) {
            pageNumbers.push(i);
        }
    } else {
        if (current_page <= 3) pageNumbers.push(1, 2, 3, 4, "...", last_page);
        else if (current_page >= last_page - 2) pageNumbers.push(1, "...", last_page - 3, last_page - 2, last_page - 1, last_page);
        else pageNumbers.push(1, "...", current_page - 1, current_page, current_page + 1, "...", last_page);
    }
    const handleNavigatePrevious = () => {
        if(onPageChange) onPageChange(current_page - 1);
        else navigate(current_page > 1 ? `/${url_end_point}/${current_page - 1}/12` : `/${url_end_point}/${current_page}/12`);
    };
    const handleNavigateNext = () => {
        if(onPageChange) onPageChange(current_page + 1);
        else navigate(current_page < last_page ? `/${url_end_point}/${current_page + 1}/12` : `/${url_end_point}/${current_page}/12`);
    };
    const handleNavigateToPage = (page:number) => {
        if(onPageChange) onPageChange(page);
        else navigate(`/${url_end_point}/${page}/12`)
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem className="cursor-pointer">
                    <PaginationPrevious 
                        className="hidden md:flex" 
                        onClick={handleNavigatePrevious} 
                    />
                    <Button 
                        className="md:hidden" 
                        variant={'link'}
                        onClick={handleNavigatePrevious}
                    ><ChevronsLeft className="size-4" /></Button>
                </PaginationItem>

                {pageNumbers.map((page, index) => (
                    <PaginationItem key={index} className="cursor-pointer">
                        {typeof page === "number" ? (
                            <PaginationLink onClick={()=>handleNavigateToPage(page)} isActive={page === current_page}>
                                {page}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}
                <PaginationItem className="cursor-pointer">
                    <PaginationNext 
                        className="hidden md:flex" 
                        onClick={handleNavigateNext} 
                    />
                    <Button 
                        className="md:hidden" 
                        variant={'link'}
                        onClick={handleNavigateNext}
                    ><ChevronsRight className="size-4" /></Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};