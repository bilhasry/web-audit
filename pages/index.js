import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForm = async (event) => {
    setLoading(true)
    event.preventDefault();
    
    // Get data from the form.
    const data = {
      first: event.target.first_url.value,
      second: event.target.second_url.value,
    }
    // API endpoint where we send form data.
    const endpoint = '/api/audit'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(data),
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    setLoading(false);
    setData(result);
    
  }
  return (
    <div className="container mx-auto">
        <header className="text-center py-8">
          <h1 className="text-3xl font-bold">
            Web Audit
          </h1>
          <p>Audit your website performance base on the lighthouse plugin</p>
        </header>
        <div className="container flex mx-auto">
          <div className="w-3/12">
            <h3 className="text-left py-4">
              Please add your url to compare the web performance
            </h3>
            <form onSubmit={handleForm} className="flex flex-wrap flex-row items-center">
              <div className="pb-4 w-full">
                <label htmlFor="first_url">First URL</label>
                <input
                  className="w-full br-4 border border-slate-500 p-2"
                  id="first_url"
                  type="text"
                  name="first_url"
                  placeholder="https://example.com"
                />
              </div>
              <div className="pb-4 w-full">
                <label htmlFor="first_url">Second URL</label>
                <input
                  className="w-full br-4 border border-slate-500 p-2"
                  type="text"
                  id="second_url"
                  name="second_url"
                  placeholder="https://example.com"
                />
              </div>
              <button type="submit" name="submit" className="bg-teal-600 br-4 border p-4 font-bold text-white">
                {!loading
                  ? 'Compare Performance'
                  : 'Loading .....'
                }
              </button>
            </form>
          </div>
          <div className="ml-20 w-8/12">
            { data !== null &&   
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                          <th scope="col" className="py-3 px-6">
                              Variables
                          </th>
                          <th scope="col" className="py-3 px-6">
                              { data.firstUrl.url }
                          </th>
                          <th scope="col" className="py-3 px-6">
                              { data.secondUrl.url }
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th>DOM Size</th>
                      <th>
                        { data.firstUrl.domSize["displayValue"]}
                      </th>
                      <th>
                        { data.secondUrl.domSize["displayValue"]}
                      </th>
                    </tr>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th>Document Size</th>
                      <th>
                        { data.firstUrl.resource[4]["transferSize"]}
                      </th>
                      <th>
                        { data.secondUrl.resource[4]["transferSize"]}
                      </th>
                    </tr>
                  </tbody>
              </table>
            }
          </div>
        </div>
    </div>
  )
}
