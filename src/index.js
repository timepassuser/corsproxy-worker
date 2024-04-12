export default {
    async fetch(request, env, ctx) {
        console.log(request.headers);
        const corsHeaders = {
            "Access-Control-Allow-Origin": "https://timepassuser.github.io",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "corsproxy,urltofetch"
        };

        async function handleOptions(request) {
            if (
                request.headers.get("Origin") !== null &&
                request.headers.get("Access-Control-Request-Method") !== null &&
                request.headers.get("Access-Control-Request-Headers") !== null
            ) {
                // Handle CORS preflight requests.
                var response = new Response(null, {
                    headers: {
                        ...corsHeaders,
                    },
                });
                return response;
            } else {
                // Handle standard OPTIONS request.
                return new Response(null, {
                    headers: {
                        Allow: "GET, HEAD, POST, OPTIONS",
                    },
                });
            }
        }

        if (request.method === "OPTIONS") {
            // Handle CORS preflight requests
            return handleOptions(request);
        }
        var headers = request.headers;
        if (request.headers.get("corsproxy") && request.headers.get("urltofetch")) {
            var urltofetch = request.headers.get("urltofetch");
            if (urltofetch.includes("https://") && urltofetch.includes("cdn3.digialm.com") && urltofetch.includes(".html")) {
                try {
                    var response = await fetch(urltofetch, {
                        signal: AbortSignal.timeout(2000)
                    });
                    response = new Response(response.body, response);
                } catch (error) {
                    var response = new Response(`Error ${error}`);
                }
            } else {
                var response = new Response("This worker only fetches a certain type of url");
            }
        } else {
            var response = new Response("Invalid Request");
        }
        response.headers.append("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
        response.headers.append("Access-Control-Allow-Headers", corsHeaders["Access-Control-Allow-Headers"]);
        return response;
    },
};