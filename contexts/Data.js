import React, { useState } from "react"
import { sprintf } from "sprintf-js"

const Data = React.createContext()

export function withData(Component, options) {
    if(!options.url || !options.keyName) {
        throw new Error("Must provide keyName and url")
    }

    return class extends React.Component {
        static async getInitialProps (ctx) {
            const props =
            (Component.getInitialProps
                ? await Component.getInitialProps(ctx)
                : {})
                
            const response = await (await fetch(sprintf(options.url, ctx.query))).json()

            if (props.statusCode && ctx.res) {
                ctx.res.statusCode = props.statusCode
            }

            return { ...props, [options.keyName]: response }
        }

        render() {
            return (
                <Data.Consumer>
                    {({ setters, values }) => {
                        const setterName = `set${options.keyName.charAt(0).toUpperCase()}${options.keyName.slice(1)}`

                        setters[setterName](this.props[options.keyName])

                        return <Component {...values} />
                    }}
                </Data.Consumer>
            )
        }
    }
}

export function DataProvider(props) {
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])

    return (
        <Data.Provider
            value={{
                values: {
                    users,
                    posts,
                    comments,
                },
                setters: {
                    setUsers,
                    setPosts,
                    setComments,
                },
            }}
        >
            {props.children}
        </Data.Provider>
    )
}
