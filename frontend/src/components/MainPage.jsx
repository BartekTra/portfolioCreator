import React from "react";
import { useUser } from "../context/UserContext";

function MainPage() {
  const { user, loading: loadingUser } = useUser();
  
  if (loadingUser) return <p>loading</p>;
  console.log(user);
  if (!user) return <p>Loadingxd</p>
  return (
    <div>
      {Object.keys(user).map(
        (key, index) =>
          index !== 0 && (
            <p key={key} className="ml-10">
              - {user[key]}{" "}
            </p>
          )
      )}
    </div>
  );
}
export default MainPage;
