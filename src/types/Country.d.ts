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
<<<<<<< HEAD
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
  
=======
}
>>>>>>> c0e5801257af601f89511f7d4cbbc4208ce740f8
