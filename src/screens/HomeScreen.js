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
        <h2 className="my-3 sandbeige">News</h2>
        <Table
          variant="dark"
          className="mt-3 mb-5"
          hover
          style={{ "--bs-table-bg": "none" }}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {latestUpdateNews &&
              latestUpdateNews.map((news) => {
                return (
                  <tr
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
        <Row className="my-3">
          <Col xs={6} className="py-3">
            <Tabs
              defaultActiveKey="featureVideo"
              className="mb-4 flex-column flex-lg-row"
              transition={false}
              justify
              onSelect={getLatestVideoHandle}
            >
              <Tab
                eventKey="featureVideo"
                title="Feature video"
                className="px-3"
              >
                <div className="mb-2">Feature video on BSG Youtube channel</div>
                <YoutubePlayer url="https://www.youtube.com/watch?v=gEbJjN6rtQE" />
              </Tab>
              <Tab eventKey="latestVideo" title="Latest video" className="px-3">
                <div className="mb-2">Latest video on BSG Youtube channel</div>
                {lastestVideoId ? (
                  <YoutubePlayer
                    url={`https://www.youtube.com/watch?v=${lastestVideoId}`}
                  />
                ) : (
                  <DivLoading height={mediaColHeight} />
                )}
              </Tab>
            </Tabs>
          </Col>
          <Col xs={6} className="py-3">
            <Tabs
              defaultActiveKey="twitter"
              className="mb-4 flex-column flex-lg-row"
              transition={false}
              justify
            >
              <Tab eventKey="twitter" title="Twitter" className="px-3">
                <div className="mb-2">Latest tweet from BSG</div>
                <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName="bstategames"
                  noHeader={true}
                  theme="dark"
                  tweetLimit={10}
                  placeholder={<DivLoading height={mediaColHeight} />}
                  options={{ height: mediaColHeight }}
                />
              </Tab>
              <Tab eventKey="ph" title="Placeholder" className="px-3">
                <div className="mb-2">Placeholder</div>
                <div>123</div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export { HomeScreen }
