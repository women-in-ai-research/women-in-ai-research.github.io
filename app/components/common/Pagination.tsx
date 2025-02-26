interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 5;
      
      if (totalPages <= maxPagesToShow) {
        // If we have fewer pages than max, show all pages
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Always include first page
        pages.push(1);
        
        // Calculate start and end of page range
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);
        
        // Adjust if at the beginning or end
        if (currentPage <= 2) {
          end = 4;
        } else if (currentPage >= totalPages - 1) {
          start = totalPages - 3;
        }
        
        // Add ellipsis if needed
        if (start > 2) {
          pages.push('...');
        }
        
        // Add middle pages
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        
        // Add ellipsis if needed
        if (end < totalPages - 1) {
          pages.push('...');
        }
        
        // Always include last page
        pages.push(totalPages);
      }
      
      return pages;
    };
    
    return (
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-white hover:bg-white/10'
          }`}
        >
          Previous
        </button>
        
        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentPage === page
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="text-gray-400">
              {page}
            </span>
          )
        ))}
        
        {/* Next Button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-white hover:bg-white/10'
          }`}
        >
          Next
        </button>
      </div>
    );
  }