import React from 'react';
import ajax from 'superagent';
import ReactPaginate from 'react-paginate';
import { Button, NavItem, Grid, Row, Col, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';

import './SourceShareList.css';
import baseUrl from './config';

export default function createSourceShareList(sourceType) {
  const sourceListUrl = sourceType === "article" ? "articlelist" : "urlpublish";
  class SourceShareList extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        sourceList: [],
        offset: 0,
        perPage: 5,
        sourceListLoaded: false
      };
    }

    loadSourceFromServer = () => {
      ajax.get(`${baseUrl}/${sourceListUrl}/`)
      .query({ limit: this.state.perPage, offset: this.state.offset })
      .end((error, response) => {
        if (!error && response) {
          this.setState({ sourceList: response.body.results,
            pageCount: Math.ceil(response.body.count / this.state.perPage) });
          this.setState({ sourceListLoaded: true });
        } else {
          console.log("source list fetching error!");
        }
      });
    }

    componentWillMount() {
      this.loadSourceFromServer();
    }

    handleReadCountChange = (id, count) => {
      if (sourceType !== "article") {
        ajax.patch(`${baseUrl}/urlpublish/${id}/`)
        .send({ urlreadcount: ++count })
        .end((error, response) => {
          if (!error && response) {
            console.log('success');
          } else {
            console.log('fail');
          }
        });
      } else {
        ajax.patch(`${baseUrl}/articlelist/${id}/`)
        .send({ article_readcount: ++count })
        .end((error, response) => {
          if (!error && response) {
            console.log('success');
          } else {
            console.log('fail');
          }
        });
      }
    }

    handlePageClick = (data) => {
      const selected = data.selected;
      const offset = Math.ceil(selected * this.state.perPage);

      this.setState({ offset }, () => {
        this.loadSourceFromServer();
      });
    };

    render() {
      if (this.state.sourceListLoaded === true) {
        return (
          <div className="source-share-list">
            <h1 className="title-h">资源分享</h1>
            <p className="title-p"><label className="of" />来自IT各个领域的学习资源<label className="on" /></p>
            <Grid>
              <Row className="show-grid">
                <Col xs={14} md={9}>
                  <div className="source-card-list">
                    {
                  this.state.sourceList.map((source) => {
                    let id = 0;
                    let userName = "";
                    let userId = 0;
                    let urlIntroduce = "";
                    let urlPubulishTime = "";
                    let urlReadCount = 0;
                    let commentLength = 0;

                    if (sourceType === "article") {
                      id = source.id;
                      userName = source.article_owner;
                      userId = source.usernameid;
                      urlIntroduce = source.article_abstract;
                      urlPubulishTime = source.created;
                      urlReadCount = source.article_readcount;
                      commentLength = source.articlecomment_set.length;
                    } else {
                      id = source.id;
                      userName = source.url_owner;
                      userId = source.usernameid;
                      urlIntroduce = source.urlintroduce;
                      urlPubulishTime = source.created.slice(0, 16);
                      urlReadCount = source.urlreadcount;
                      commentLength = source.urlcomment_set.length;
                    }

                    return (
                      <Grid>
                        <Row className="show-grid">
                          <Col xs={12} md={9}>
                            <div className="source-card" key={source.id}>
                              <p>
                                <b className="b-by">BY</b>
                                <b className="b-username"><Link to={`user/${userId}`}>{userName}</Link></b>
                                <b className="b-publishtime">{urlPubulishTime}</b>
                                  阅读量：{urlReadCount} &nbsp;&nbsp;
                                  评论量：{commentLength}
                              </p>
                              <p>{urlIntroduce}</p>
                              <LinkContainer to={`/${sourceType}/${id}`}>
                                <NavItem>
                                  <Button bsStyle="danger" onClick={() => this.handleReadCountChange(id, urlReadCount)}>了解详情</Button>
                                </NavItem>
                              </LinkContainer>
                            </div>
                          </Col>
                        </Row>
                      </Grid>
                    );
                  })
                }</div>
                </Col>
                <Col xs={6} md={3}>
                  <div >
                    <Panel header="推荐小组">
                      <ListGroup fill>
                        <ListGroupItem>
                          <Link>微软创新工作室</Link>
                        </ListGroupItem>
                        <ListGroupItem>
                          <Link>择栖工作室</Link>
                        </ListGroupItem>
                        <ListGroupItem>
                          <Link>Oxgen工作室</Link>
                        </ListGroupItem>
                        <ListGroupItem>
                          <Link>Linux工作室</Link>
                        </ListGroupItem>
                        <ListGroupItem>
                          <Link>&hellip;</Link>
                        </ListGroupItem>
                      </ListGroup>
                    </Panel>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div >
                    <Panel header="推荐标签">
                      <ListGroup fill>
                        <ListGroupItem>
                          <Link>React</Link>
                        </ListGroupItem>
                        <ListGroupItem>
                          <Link>Python</Link>
                        </ListGroupItem>
                        <ListGroupItem>
                          <Link>前端</Link>
                        </ListGroupItem>
                        <ListGroupItem>
                          <Link>&hellip;</Link>
                        </ListGroupItem>
                      </ListGroup>
                    </Panel>
                  </div>
                </Col>
              </Row>
            </Grid>
            <Grid>
              <Row className="show-grid">
                <Col xs={6} xsOffset={3}>
                  <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={<a href="">...</a>}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                  />
                </Col>
              </Row>
            </Grid>
          </div>
        );
      }
      return null;
    }
}

  return SourceShareList;
}
