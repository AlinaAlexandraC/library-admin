export const fetchData = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    };

    if (body) {
      options.body = JSON.stringify(body); 
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}`, options);

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
  } catch (error) {    
    throw new Error(error.message || 'An error occurred');
  }
};
