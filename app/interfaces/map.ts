export interface MapState {
    initial ?: boolean,
    searching ?: boolean,
    authorized ?: boolean,
    direction ?: string,
    clicked ?: boolean,
    editable ?: boolean,
    cost ?: boolean,
    error ?: boolean,
    onmapsearch ?: boolean,
    dragStart ?: boolean,
    savedTrip?: boolean,
    tripFinished?: boolean;
}

// initial - is it initial load of map

// searching - is address searching now