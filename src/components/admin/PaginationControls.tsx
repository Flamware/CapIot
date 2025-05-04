import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '../types/pagination.ts';

interface PaginationControlsProps {
    pagination: Pagination;
    onGoToPage: (page: number) => void;
    onGoToPreviousPage: () => void;
    onGoToNextPage: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
                                                                          pagination,
                                                                          onGoToPage,
                                                                          onGoToPreviousPage,
                                                                          onGoToNextPage,
                                                                      }) => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 1) {
        return null; // Don't show pagination if there's only one page
    }

    return (
        <div className="flex items-center justify-end space-x-2">
            <button
                onClick={onGoToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => onGoToPage(page)}
                    className={`px-3 py-1 border rounded text-sm hover:bg-gray-100 ${
                        currentPage === page ? 'bg-blue-500 text-white' : ''
                    }`}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={onGoToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
};