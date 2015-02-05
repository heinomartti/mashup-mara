# mashup-mara
The project plan.

I will be experimenting client-server architecture with nodejs.
- nodejs side fetches data from two open data providers (url) and combine them somehow
- I won't have time to think about logic of data, so I will combine "books with apples" or whatever
- First doing it so as current example indicates, you kind of prefetch the data from open APIs and provide always the same static data.
- Later, if I can (no threads, panic), I would like to fetch data from Open APIs once the server request comes.
- First I would send data back as some very simple HTML.
- Later I would also like to send combined data further as JSON to the client (HTML page doing the request), which then generates HTML and shows the data.
- HTML page will be ugly as hell, but the main thing is that I can perform HTTP requests and get the combined data from the server.
