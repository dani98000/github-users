import axios from "axios";
import React, { useEffect, useState } from "react";

const rootUrl = "https://api.github.com";

export const GithubContext = React.createContext();

export const GithubProvider = ({ children }) => {
  // const [githubUser, setGithubUser] = useState(mockUser);
  // const [repos, setRepos] = useState(mockRepos);
  // const [followers, setFollowers] = useState(mockFollowers);

  const [githubUser, setGithubUser] = useState({});
  const [repos, setRepos] = useState({});
  const [followers, setFollowers] = useState({});

  useEffect(() => {
    searchGithubUser("frenck");
  }, []);

  // request loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // Errors
  const [error, setError] = useState({ show: false, msg: "" });

  // Check rate
  const checkRequests = async () => {
    try {
      const {
        rate: { remaining },
      } = await (await axios(`${rootUrl}/rate_limit`)).data;
      setRequests(remaining);
      if (remaining === 0) {
        toggleError(true, "sorry, you have exceeded your hourly rate limit!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch user
  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    const res = await axios(`${rootUrl}/users/${user}`).catch((err) => {
      console.log(err);
    });
    if (res) {
      setGithubUser(res.data);
      const { login, followers_url } = res.data;
      const reposPromise = axios(
        `${rootUrl}/users/${login}/repos?per_page=100`
      );
      const followersPromise = axios(`${followers_url}?per_page=100`);

      try {
        const [repos, followers] = await Promise.allSettled([
          reposPromise,
          followersPromise,
        ]);
        const status = "fulfilled";
        if (repos.status === status) {
          setRepos(repos.value.data);
        }
        if (followers.status === status) {
          setFollowers(followers.value.data);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toggleError(true, "there is no user with that username");
    }
    checkRequests();
    setIsLoading(false);
  };

  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  useEffect(() => {
    checkRequests();
  }, [checkRequests]);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
