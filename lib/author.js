var url = require("url");
var template = require("./template");
var db = require("./db");
var qs = require("querystring");
const sanitizeHtml = require("sanitize-html");

exports.home = function (request, response) {
  db.query("SELECT * FROM topic", function (error, topics) {
    if (error) throw error;
    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) throw error2;
      var list = template.list(topics);
      var html = template.html(
        "Authors",
        list,
        `${template.authorlist(authors)}
      <style>
      table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
      }
      </style>
      <form action="/author_create" method="POST">
            <p><input type="text" name="name" placeholder="name"/></p>
            <p>
              <textarea name="profile" placeholder="profile"></textarea>
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

exports.create = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });
  request.on("end", function () {
    var post = qs.parse(body);
    db.query(
      `INSERT INTO author (name, profile) VALUES (?, ?)`,
      [post.name, post.profile],
      function (error, results, fields) {
        if (error) throw error;
        console.log("The author has been saved!");
        response.writeHead(302, { Location: `/author` });
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
    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) throw error2;
      db.query(
        "SELECT * FROM author WHERE id=?",
        [queryData.id],
        function (error3, author) {
          if (error3) throw error3;
          var list = template.list(topics);
          var html = template.html(
            "Authors",
            list,
            `${template.authorlist(authors)}
      <style>
      table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
      }
      </style>
      <form action="/author_update_process" method="POST">
      <input type="hidden" name="id" value="${author[0].id}"/>
            <p><input type="text" name="name" value="${sanitizeHtml(
              author[0].name
            )}"placeholder="name"/></p>
            <p>
              <textarea name="profile" placeholder="profile">${sanitizeHtml(
                author[0].profile
              )}</textarea>
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
        }
      );
    });
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
      `UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name, post.profile, post.id],
      function (error, results, fields) {
        if (error) throw error;
        console.log("The author has been updated!");
        response.writeHead(302, { Location: `/author` });
        response.end();
      }
    );
  });
};

exports.delete = function (request, response) {
  var body = "";
  request.on("data", function (data) {
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });
  request.on("end", function () {
    var post = qs.parse(body);
    console.log(post);
    db.query(`DELETE FROM author WHERE id=?`, [post.id], function (error) {
      if (error) throw error;
      db.query(
        `DELETE FROM topic WHERE author_id=?`,
        [post.id],
        function (error2) {
          if (error2) throw error2;
          console.log("The author and author's topic deleted!");
          response.writeHead(302, { Location: `/author` });
          response.end();
        }
      );
    });
  });
};
