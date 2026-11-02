
type KindLabel = Record<string, string>;

const kind_labels : KindLabel = {
    "accounts": "company accounts",
    "vat": "vat",
    "corptax": "corporation tax",
};

export function get_kind_label(k : string) : string {
    return kind_labels[k]
}

