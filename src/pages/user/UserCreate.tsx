import { useNavigate } from "react-router-dom";
import UserForm from "../../components/form/user/userForm";
import userApi from "../../apis/user/user.api";

function UserCreate() {
  const navigate = useNavigate();

  const handleAdd = (user: any) => {
    console.log("user---------", user);

    userApi
      .createUser(user)
      .then((response) => {
        navigate("/users");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response?.statusText);
        }
      });
  };

  return (
    <>
      <h1>Thêm mới người dùng</h1>
      <UserForm
        userId=""
        onSubmit={handleAdd}
        onCancel={() => navigate("/users")}
      />
    </>
  );
}

export default UserCreate;
