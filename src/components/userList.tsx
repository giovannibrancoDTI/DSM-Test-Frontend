import { User } from "@/domain/types";
import { Card } from "./ui/card";
import { useNavigate } from "react-router-dom";

interface IUserListProps {
  users: User[];
}

const UserList = ({ users }: IUserListProps) => {
  const navigate = useNavigate();

  const handleClick = (user: User) => {
    navigate(`/${user.id}/albums`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users.map((user) => (
        <Card
          key={user.id}
          className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer ${className}"
          onClick={() => handleClick(user)}
        >
          <h2 className="text-xl font-semibold ">{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Username: {user.username}</p>
        </Card>
      ))}
    </div>
  );
};

export default UserList;
