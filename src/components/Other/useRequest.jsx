function useRequest() {
  const request = async (method, url, data = false, csrftoken = false) => {
    const opt = {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: method,
    }
    if(data) {
      opt['body'] = JSON.stringify(data)
    }
    if(csrftoken) {
      opt.headers['X-CSRFToken'] = csrftoken
    }
    return fetch(url, opt)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return response.json()
        .then((error) => {
          throw Error(error)
        })
        // throw Error(`Something went wrong: code ${response.status}`)
      }
    })
    // .then((data) => {
    //   return data
    // })
    .catch(error => {
      console.log(error.message)
      try {
        return JSON.parse(error.message)
      } catch (e) {
        return error.message
      }
    })
  }

  return { request }
}

export default useRequest;