import React from "react"
import { Link } from "react-router-dom"
import { InputGroup, Form, Button } from "react-bootstrap"
import { Fleamarket } from "../components/Fleamarket"
import { HeadMeta } from "../components/HeadMeta"

const FleamarketScreen = () => {
  return (
    <>
      <HeadMeta title="Fleamarket" />
      <InputGroup size="lg" className="my-3">
        <Form.Control
          placeholder="Enter item name"
          aria-label="item's name"
          aria-describedby="button-search"
        />
        <Button variant="secondary" id="button-search">
          Search
        </Button>
      </InputGroup>
      <Fleamarket />
    </>
  )
}

export { FleamarketScreen }
