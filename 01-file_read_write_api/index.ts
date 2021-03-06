import { createServer } from "http";
import url from "url";

import { addUserToFile, deleteUser, readUserData, updateUser } from "./utils";

const port: number = 3000;
const host: string = "localhost";

const server = createServer(async (req, res) => {
  if (req.url?.match(/\/users\/*/) && req.method === "GET") {
    res.writeHead(200, { "content-type": "application/json" });

    const parsedUrl = url.parse(req.url as string);

    if (!parsedUrl.search) {
      res.write(readUserData());
      res.end();
    } else {
      const id: number = +parsedUrl.search.split("=")[1];
      res.write(readUserData(id));
      res.end();

      return;
    }
  }

  if (req.url === "/user" && req.method === "POST") {
    const id: number = +req.url!.split("/")[2];

    let body = "";
    // listen to data sent by client
    req.on("data", (chunk) => {
      // append the string version to the body
      body += chunk.toString();
    });
    // listen till the end
    req.on("end", () => {
      // send back the data
      // console.log(body);
      if (addUserToFile(body)) {
        res.writeHead(200);
        res.end("User Added Successfully");
      } else {
        res.writeHead(400);
        res.end("User Exists Already");
      }
    });

    return;
  }

  if (req.url!.match(/\/user\/([0-9]+)/) && req.method === "DELETE") {
    const id: number = +req.url!.split("/")[2];

    res.writeHead(200, { "content-type": "application/json" });
    deleteUser(id);

    res.end(`User ${id} is now deleted `);

    return;
  }

  if (req.url!.match("/user") && req.method === "PUT") {
    const id: number = +req.url!.split("/")[2];

    let body = "";
    // listen to data sent by client
    req.on("data", (chunk) => {
      // append the string version to the body
      body += chunk.toString();
    });
    // listen till the end
    req.on("end", () => {
      // send back the data
      // console.log(body);

      if (updateUser(body)) {
        res.writeHead(200);
        res.end("User updated successfully.");
      } else {
        res.writeHead(400);
        res.end("User does not exist.");
      }
    });

    return;
  }

  res.end("invalid endpoint");
});

server.listen(port, host, () => {
  console.log(`server running a port: ${port}`);
});
