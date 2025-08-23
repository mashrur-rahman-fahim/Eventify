import React, { useContext, useEffect } from "react";
import { VerifyContext } from "../context/VerifyContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useState } from "react";
export const ClubAdmin = () => {
  const navigate = useNavigate();
  const { isAdmin, isVerified, isLoading, checkLogin } =
    useContext(VerifyContext);
  const [formClub, setFormClub] = useState({
    name: "",
    description: "",
  });
  const [club, setClub] = useState([]);
  useEffect(() => {
    checkLogin();
  }, [checkLogin]);
  useEffect(() => {
    if ((!isAdmin || !isVerified) && !isLoading) {
      navigate("/");
    }
  }, [isAdmin, isVerified, isLoading, navigate]);
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await api.get("/api/club/getClubByUserId");
        setClub(response.data.clubs);
      } catch (error) {
        console.log(error);
      }
    };
    fetchClubs();
  }, []);
  const createClub = async () => {
    try {
      const response = await api.post("/api/club/create", formClub);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteClub = async (clubId) => {
    try {
      const response = await api.delete(`/api/club/delete/${clubId}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const leaveClub = async (clubId) => {
    try {
      const response = await api.delete(`/api/club/leave/${clubId}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Club Administration</h1>

      <div>
        <h2>Create New Club</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createClub();
          }}
        >
          <div>
            <label htmlFor="clubName">Club Name:</label>
            <input
              type="text"
              id="clubName"
              value={formClub.name}
              onChange={(e) =>
                setFormClub({ ...formClub, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label htmlFor="clubDescription">Description:</label>
            <textarea
              id="clubDescription"
              value={formClub.description}
              onChange={(e) =>
                setFormClub({ ...formClub, description: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Create Club</button>
        </form>
      </div>

      <div>
        <h2>My Clubs</h2>
        {club.length === 0 ? (
          <p>No clubs found.</p>
        ) : (
          <ul>
            {club.map((clubItem) => (
              <li key={clubItem._id}>
                <h3>{clubItem.name}</h3>
                <p>{clubItem.description}</p>
                <div>
                  <button onClick={() => deleteClub(clubItem._id)}>
                    Delete Club
                  </button>
                  <button onClick={() => leaveClub(clubItem._id)}>
                    Leave Club
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
