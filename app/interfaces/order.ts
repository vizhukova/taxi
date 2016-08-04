export interface Source {
    city : string
    closestStation : string
    country : string
    description : string
    entrance : string
    fullAddress : string
    housing : string
    index : number
    kind : string
    lat : number
    lon : number
    shortAddress : string
}

export interface Destination {
    city : string
    closestStation : string
    country : string
    description : string
    entrance : string
    fullAddress : string
    housing : string
    index : number
    kind : string
    lat : number
    lon : number
    shortAddress : string
}


export interface Order{

    bookingDate: string
    bookmins: string
    booktype: string
    destinations: Destination[]
    recipientBlackListed: string
    recipientLoyal: string
    recipientPhone: string
    requirements: string[]
    source: Source
    urgent: boolean
    vehicleClass: string

}