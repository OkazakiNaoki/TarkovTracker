import React from "react"
import { Breadcrumb, Dropdown } from "react-bootstrap"

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
  >
    <span className="me-2">{children}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white">
      <path d="M12 17.414 3.293 8.707l1.414-1.414L12 14.586l7.293-7.293 1.414 1.414L12 17.414z" />
    </svg>
  </a>
))

const GuidingBreadcrumb = ({ paths, dropdownContent }) => {
  return (
    <Breadcrumb>
      {paths.map((path, i) => {
        if (i !== paths.length - 1) {
          return (
            <Breadcrumb.Item key={path.name} onClick={path.callback}>
              {path.name}
            </Breadcrumb.Item>
          )
        } else if (i === 0 && i === paths.length - 1) {
          return (
            <Breadcrumb.Item key={path.name} active>
              {path.name}
            </Breadcrumb.Item>
          )
        } else {
          return (
            <Breadcrumb.Item key={path.name} active>
              <Dropdown className="d-inline">
                <Dropdown.Toggle
                  id="dropdown-custom-components"
                  as={CustomToggle}
                >
                  {path.name}
                </Dropdown.Toggle>

                <Dropdown.Menu variant="dark">
                  {dropdownContent.map((content, j) => {
                    return (
                      <Dropdown.Item
                        key={`handbook_dropdown_${j}`}
                        eventKey={`${j + 1}`}
                        active={content.name === path.name}
                        onClick={
                          content.name !== path.name ? content.callback : null
                        }
                      >
                        {content.name}
                      </Dropdown.Item>
                    )
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </Breadcrumb.Item>
          )
        }
      })}
    </Breadcrumb>
  )
}

export { GuidingBreadcrumb }
