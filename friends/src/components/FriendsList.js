import React from "react";

const FriendsList = props => {
  return (
    <div>
      {props.friends.map(friend => (
        <div className="friend-card" key={friend.id}>
          <h1>{friend.name}</h1>
          <p>{friend.age}</p>
          <p>{friend.email}</p>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;