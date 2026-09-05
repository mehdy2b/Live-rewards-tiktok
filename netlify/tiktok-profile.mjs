export default async (req) => {
  try {
    const url = new URL(req.url);
    let username = (url.searchParams.get("username") || "")
      .trim()
      .replace(/^@+/, "");

    if (!username) {
      return new Response(JSON.stringify({ error: "Pseudo manquant" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }

    const profileUrl =
      "https://www.tiktok.com/@" + encodeURIComponent(username);

    const oembedUrl =
      "https://www.tiktok.com/oembed?url=" +
      encodeURIComponent(profileUrl);

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Profil introuvable" }),
        {
          status: 404,
          headers: { "content-type": "application/json" }
        }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify({
        username: username,
        profile_url: profileUrl,
        author_name: data.author_name || "",
        author_url: data.author_url || profileUrl,
        html: data.html || ""
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      {
        status: 500,
        headers: { "content-type": "application/json" }
      }
    );
  }
};
