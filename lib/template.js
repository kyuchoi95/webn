const sanitizeHtml = require("sanitize-html");

module.exports = {
  html: function (title, list, body, control) {
    return `
      <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="style.css" />
        <script src="colors.js"></script>
      </head>
      <body>
        <h1><a href="/"> Node.js-mysql </a></h1>
        <div id="grid">
        <a href="/author">author</a>
          ${list}
          ${control}
          <div id="body">
          ${body}
          </div>
        </div>
        <!--<input
          type="button"
          value="night"
          onclick=" 
        nightDayHandler(this);
      "
        />-->
      </body>
    </html>
      `;
  },
  list: function (topics) {
    var list = `<ol>`;
    var i = 0;
    while (i < topics.length) {
      list =
        list +
        `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(
          topics[i].title
        )}</a></li>`;
      i = i + 1;
    }
    list = list + `</ol>`;
    return list;
  },
  authorSelect: function (authors, author_id) {
    var tag = "";
    var i = 0;
    while (i < authors.length) {
      var selected = "";
      if (author_id === authors[i].id) {
        selected = " selected";
      }
      tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(
        authors[i].name
      )}</option>`;
      i++;
    }
    return ` 
    <select name="author">
    ${tag}
  </select>`;
  },
  authorlist: function (authors) {
    var tag = "";
    var i = 0;
    while (i < authors.length) {
      tag += `<tr>
      <td>${sanitizeHtml(authors[i].name)}</td>
      <td>${sanitizeHtml(authors[i].profile)}</td>
      <td><a href="/author_update?id=${authors[i].id}">update</a></td>
      <td><form action="author_delete", method="POST">
      <input type="hidden" name="id" value="${authors[i].id}" />
      <input type="submit" value="delete" />
    </form></td>
  </tr>`;
      i++;
    }

    return `
    <table>
        <tr>
            <th>name</th>
            <th>profile</th>
            <th>update</th>
            <th>delete</th>
        </tr>
        ${tag}
    </table>
    `;
  },
};
