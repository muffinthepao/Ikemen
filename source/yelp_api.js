const yelpAPIResponse = async function (yelpURI) {
    try {
       const test = await fetch(yelpURI, {
            method: "GET",
            headers: {
                Authorization: process.env.YELP_API,
            },
        });

        const apiFetchResponse = await test.json();
        return apiFetchResponse

    } catch (err) {
      console.log(err)
      return err
    }
};

module.exports = yelpAPIResponse

