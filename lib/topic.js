var url = require("url");
var template = require("./template");
var db = require("./db");
var qs = require("querystring");
const sanitizeHtml = require("sanitize-html");

exports.home = function (request, response) {
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) throw error;
    var title = "Welcome";
    var description = "Hello, Node JS";
    var list = template.list(topics);
    var html = template.html(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) throw error;
    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [queryData.id],
      function (error2, topic) {
        if (error2) throw error2;
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.html(
          title,
          list,
          `<h2>${sanitizeHtml(title)}</h2>
              ${sanitizeHtml(description)}
              <p>by ${sanitizeHtml(topic[0].name)}</p>`,
          `<a href="/create">create</a>
            <a href="/update?id=${queryData.id}">update</a>
            <form action="delete_process", method="POST">
              <input type="hidden" name="id" value="${queryData.id}" />
              <input type="submit" value="delete" />
            </form>
            `
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = function (request, response) {
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) throw error;
    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) throw error2;
      var title = "WEB - create";
      var list = template.list(topics);
      var html = template.html(
        sanitizeHtml(title),
        list,
        `<form action="/create_process" method="POST">
            <p><input type="text" name="title" placeholder="title"/></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              ${template.authorSelect(authors)}
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>
          `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      `INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`,
      [post.title, post.description, post.author],
      function (error, results, fields) {
        if (error) throw error;
        console.log("The file has been saved!");
        response.writeHead(302, { Location: `/?id=${results.insertId}` });
        response.end();
      }
    );
  });
};

exports.update = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) throw error;
    db.query(
      `SELECT * FROM topic WHERE id=?`,
      [queryData.id],
      function (error2, topic) {
        if (error2) throw error2;
        db.query("SELECT * FROM author", function (error3, authors) {
          if (error3) throw error3;
          console.log(topic);
          var list = template.list(topics);
          var html = template.html(
            sanitizeHtml(topic[0].title),
            list,
            `<form action="/update_process" method="POST">
              <input type="hidden" name="id" value="${topic[0].id}"/>
            <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(
              topic[0].title
            )}"/></p>
            <p>
              <textarea name="description" placeholder="description">${sanitizeHtml(
                topic[0].description
              )}</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>
          `,
            `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }
    );
  });
};

exports.update_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });
  request.on("end", function () {
    var post = qs.parse(body);
    console.log(post);
    db.query(
      `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
      [post.title, post.description, post.author, post.id],
      function (error, results, fields) {
        if (error) throw error;
        console.log("The file has been saved!");
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
      }
    );
  });
};

exports.delete_process = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      `DELETE FROM topic WHERE id=?`,
      [post.id],
      function (error, results, fields) {
        if (error) throw error;
        console.log("The file deleted!");
        response.writeHead(302, { Location: `/` });
        response.end();
      }
    );
  });
};
