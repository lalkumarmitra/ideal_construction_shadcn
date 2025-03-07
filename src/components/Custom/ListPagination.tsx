import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const ListPagination = ({ last_page, current_page, url_end_point }: { last_page: number, current_page: number, url_end_point: string }) => {
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

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem className="cursor-pointer">
                    <PaginationPrevious onClick={() => navigate(current_page > 1 ? `/${url_end_point}/${current_page - 1}/12` : `/${url_end_point}/${current_page}/12`)} />
                </PaginationItem>

                {pageNumbers.map((page, index) => (
                    <PaginationItem key={index} className="cursor-pointer">
                        {typeof page === "number" ? (
                            <PaginationLink onClick={() => navigate(`/${url_end_point}/${page}/12`)} isActive={page === current_page}>
                                {page}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}
                <PaginationItem className="cursor-pointer">
                    <PaginationNext onClick={() => navigate(current_page < last_page ? `/${url_end_point}/${current_page + 1}/12` : `/${url_end_point}/${current_page}/12`)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};