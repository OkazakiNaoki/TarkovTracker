import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Row, Col, Tabs, Tab, Table } from "react-bootstrap"
import { TwitterTimelineEmbed } from "react-twitter-embed"
import { HeadMeta } from "../components/HeadMeta"
import { DivLoading } from "../components/DivLoading"
import { YoutubePlayer } from "../components/YoutubePlayer"
import { getLatestUpdateNews, getLatestVideo } from "../reducers/MediaSlice"

const HomeScreen = () => {
  // hooks state
  const [mediaColHeight, setMediaColHeight] = useState(400)

  // redux state
  const {
    latestVideoFetched,
    lastestVideoId,
    lastestUpdateNewsFetched,
    latestUpdateNews,
  } = useSelector((state) => state.socialMedia)

  // redux dispatch
  const dispatch = useDispatch()

  // handle
  const getLatestVideoHandle = (key) => {
    if (key === "latestVideo" && !latestVideoFetched) {
      dispatch(getLatestVideo())
    }
  }

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // effect
  useEffect(() => {
    if (!lastestUpdateNewsFetched) {
      dispatch(getLatestUpdateNews())
    }
  }, [lastestUpdateNewsFetched])

  return (
    <>
      <HeadMeta title="Home page" />
      <Container>
        <h1 className="my-3 sandbeige">News</h1>
        <Row className="my-5">
          <Col className="py-3">
            <div className="px-3">
              <Table variant="dark" hover style={{ "--bs-table-bg": "none" }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                  </tr>
                </thead>
                <tbody>
                  {latestUpdateNews &&
                    latestUpdateNews.map((news, i) => {
                      return (
                        <tr
                          key={"news_" + i}
                          role="button"
                          onClick={() => {
                            openInNewTab(
                              `https://www.escapefromtarkov.com${news.link}`
                            )
                          }}
                        >
                          <td>{news.date}</td>
                          <td>{news.title}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col className="py-3">
            <div className="px-3">
              <TwitterTimelineEmbed
                sourceType="profile"
                screenName="bstategames"
                noHeader={true}
                theme="dark"
                tweetLimit={10}
                placeholder={<DivLoading height={mediaColHeight} />}
                options={{ height: mediaColHeight }}
              />
            </div>
          </Col>
        </Row>

        <h1 className="my-3 sandbeige">Video</h1>
        <Tabs
          defaultActiveKey="featureVideo"
          className="my-5 flex-column flex-lg-row"
          transition={false}
          onSelect={getLatestVideoHandle}
        >
          <Tab eventKey="featureVideo" title="Feature" className="px-3">
            <YoutubePlayer url="https://www.youtube.com/watch?v=gEbJjN6rtQE" />
          </Tab>
          <Tab eventKey="latestVideo" title="Latest" className="px-3">
            {lastestVideoId ? (
              <YoutubePlayer
                url={`https://www.youtube.com/watch?v=${lastestVideoId}`}
              />
            ) : (
              <DivLoading height={mediaColHeight} />
            )}
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}

export { HomeScreen }
