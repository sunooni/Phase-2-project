import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import AuthorCard from "../entities/ui/AuthorCard";
import axiosinstance from "../shared/axiosinstance";

function AuthorPage({ user, deleteHandler }) {
  const [userNews, setUserNews] = useState([]);

  useEffect(() => {
    axiosinstance
      .get("/contents/my")
      .then((res) => res.data)
      .then((data) => setUserNews(data));
  }, [user]);

  return (
    <>
      <Container>
        <h1 style={{ textAlign: "center" }}>Мои новости</h1>
        <Row>
          {user &&
            userNews.map((news) => (
              <Col sm={3} key={news.id}>
                <AuthorCard
                  news={news}
                  user={user}
                  deleteHandler={deleteHandler}
                />
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
}

export default AuthorPage;
