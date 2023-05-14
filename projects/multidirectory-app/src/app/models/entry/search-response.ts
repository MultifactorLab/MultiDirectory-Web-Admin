export interface SearchResponse {
    resultCode: number;
    matchedDn: string;
    errorMessage: string;
    search_result: SearchEntry[];
}


export interface SearchEntry {
    object_name: string;
    partial_attributes: PartialAttribute[];
}

export interface PartialAttribute {
    type: string;
    vals: string[];
}
