import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../../components/form/user/userForm";
import userApi from "../../apis/user/user.api";

interface UserEditParams extends Record<string, string> {
  id: string;
}

function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams<UserEditParams>();

  const handleUpdate = (user: any) => {
    id &&
      userApi
        .updateUser(id, user)
        .then(() => {
          navigate("/users");
        })
        .catch(
          (error: { response: { status: number; statusText: string } }) => {
            if (error.response.status === 401) {
              alert(error.response.statusText);
              navigate("/login");
            } else {
              alert(error.response.statusText);
            }
          }
        );
  };
  return (
    <>
      <h1>Chỉnh sửa thông tin người dùng</h1>
      <UserForm
        userId={id ?? ""}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/users")}
      />
    </>
  );
}
export default UserEdit;
