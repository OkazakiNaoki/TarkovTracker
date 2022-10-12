import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap"
import { TwitterTimelineEmbed } from "react-twitter-embed"
import { HeadMeta } from "../components/HeadMeta"
import { DivLoading } from "../components/DivLoading"
import { YoutubePlayer } from "../components/YoutubePlayer"
import { getLatestVideo } from "../reducers/MediaSlice"

const HomeScreen = () => {
  // hooks state
  const [mediaColHeight, setMediaColHeight] = useState(400)

  // redux state
  const { latestVideoFetched, lastestVideoId } = useSelector(
    (state) => state.socialMedia
  )

  // redux dispatch
  const dispatch = useDispatch()

  // handle
  const getLatestVideoHandle = (key) => {
    if (key === "latestVideo" && !latestVideoFetched) {
      dispatch(getLatestVideo())
    }
  }

  return (
    <>
      <HeadMeta title="Home page" />
      <Container>
        <Row>
          <Col xs={6} className="py-3">
            <Tabs
              defaultActiveKey="featureVideo"
              className="mb-4 flex-column flex-lg-row"
              transition={false}
              justify
              onSelect={getLatestVideoHandle}
            >
              <Tab eventKey="featureVideo" title="Feature video">
                <div className="mb-2">Feature video on BSG Youtube channel</div>
                <YoutubePlayer url="https://www.youtube.com/watch?v=gEbJjN6rtQE" />
              </Tab>
              <Tab eventKey="latestVideo" title="Latest video">
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
              <Tab eventKey="twitter" title="Twitter">
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
              <Tab eventKey="ph" title="Placeholder">
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
