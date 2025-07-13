export class ResponseData<T>{
    content?: T;
    pageable?: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last?: boolean;
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    size?: number;
    number?: number;
    numberOfElements?: number;
    sort?: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    empty?: boolean;
}