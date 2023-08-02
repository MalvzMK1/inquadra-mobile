type Country = {
    id: string
    name: string
    ISOCode: string
    flag: Flag
}

type Flag = {
    id: string
    name: string
    alternativeText: string
    url: string
    hash?: string
}


interface CountryAPI {
    id: string;
    attributes: {
      name: string;
      ISOCode: string;
      flag: {
        data: {
          id: string;
          attributes: {
            name: string;
            alternativeText: string | null;
            hash: string;
            url: string;
          };
        };
      };
    };
  }
  