import axios from "axios";
import api from "../apis/config";
import { Alert } from "bootstrap";

const HomePage = async () => {
  const app = document.getElementById("app");
  const url = "http://localhost:3000/products";
  try {
    const { data } = await api.get("/products");
    const contentHTML = /*html*/ `
    <div class="content">
    <h1>Quản lý sản phẩm</h1>
    <button class="btn btn-primary btn-add" id="btn-add">Thêm sản phẩm</button>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Images</th>
                <th>Description</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            ${data
              .map((item) => {
                return /*html*/ `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.title}</td>
                        <td>${item.price}</td>
                        <td><img src="${item.thumbnail}" alt="${item.title}" width="100"></td>
                        <td>${item.description}</td>
                        <td>
                            <button class="btn btn-danger btn-delete" data-id=${item.id} >Xóa</button>
                            <button class="btn btn-warning btn-update" data-id=${item.id}>Sửa</button>
                        </td>
                    </tr>
                `;
              })
              .join("")}
        </tbody>
    </table>
    </div>
    `;
    app.innerHTML = contentHTML;

    // Xóa
    const btnDelete = document.querySelectorAll(".btn-delete");
    for (const btn of btnDelete) {
      const id = btn.dataset.id;
      btn.addEventListener("click", async () => {
        if (confirm("Bạn có muốn xóa không")) {
          try {
            await axios.delete(`${url}/${id}`);
            alert("Đã xóa sản phẩm");
            HomePage();
          } catch (error) {
            console.error("lỗi", error);
          }
        }
      });
    }
    // Thêm sản phẩm
    const btnAdd = document.querySelector("#btn-add");
    btnAdd.addEventListener("click", async () => {
      const content = document.querySelector(".content");
      content.innerHTML = /*html*/ `
        <form id="add-form">
        <input type="text" id="title" placeholder="Tên sản phẩm...">
        <input type="number" id="price" placeholder="Giá sản phẩm..." min="0">
        <input type="text" id="thumbnail" placeholder="Link ảnh sản phẩm...">
        <textarea id="description" placeholder="Mô tả sản phẩm..."></textarea>
        <button type="submit" class="btn btn-success">Thêm mới</button>
        <a href="/" class="back-link">Quay lại</a>
        </form>
      `;

      const addForm = document.getElementById("add-form");
      addForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const title = document.getElementById("title").value;
        const price = document.getElementById("price").value;
        const thumbnail = document.getElementById("thumbnail").value;
        const description = document.getElementById("description").value;

        if (title === "") {
          alert("Nhập tên sản phẩm");
          return;
        }
        if (price === "" || isNaN(price) || price <= 0) {
          alert("Giá sản phẩm phải là số và lớn hơn 0");
          return;
        }
        if (thumbnail === "") {
          alert("Nhập link ảnh sản phẩm");
          return;
        }
        if (description === "") {
          alert("Nhập mô tả sản phẩm");
          return;
        }

        const newData = {
          title: title,
          price: price,
          thumbnail: thumbnail,
          description: description,
        };

        try {
          await api.post("/products", newData);
          alert("Đã thêm sản phẩm mới");
          HomePage();
        } catch (error) {
          console.error("Lỗi", error);
        }
      });
    });

    // Sửa sản phẩm
    const btnUpdate = document.querySelectorAll(".btn-update");
    for (const btn of btnUpdate) {
      const id = btn.dataset.id;
      btn.addEventListener("click", async () => {
        try {
          const response = await api.get(`/products/${id}`);
          const data = response.data;
          const content = document.querySelector(".content");
          content.innerHTML = /*html*/ `
          <form id="update-form">
            <input type="text" id="title" value="${data.title}">
            <input type="number" id="price" value="${data.price}">
            <input type="text" id="thumbnail" value="${data.thumbnail}">
            <textarea id="description">${data.description}</textarea>
            <button type="submit" class="btn btn-success">Cập nhật</button>
            <a href="/" class="back-link">Quay lại</a>
          </form>
          `;

          const updateForm = document.getElementById("update-form");
          updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const title = document.getElementById("title").value;
            const price = document.getElementById("price").value;
            const thumbnail = document.getElementById("thumbnail").value;
            const description = document.getElementById("description").value;

            if (
              title === "" ||
              price === "" ||
              thumbnail === "" ||
              description === ""
            ) {
              alert("Vui lòng điền đầy đủ thông tin");
              return;
            }
            if (price === "" || isNaN(price) || price <= 0) {
              alert("Giá sản phẩm phải là số và lớn hơn 0");
              return;
            }

            const newData = {
              title: title,
              price: price,
              thumbnail: thumbnail,
              description: description,
            };

            try {
              await api.put(`/products/${id}`, newData);
              alert("Đã cập nhật thông tin sản phẩm");
              HomePage();
            } catch (error) {
              console.error(error);
            }
          });
        } catch (error) {
          console.error(error);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export default HomePage;
