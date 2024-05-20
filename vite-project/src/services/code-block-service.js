import apiClient, { CanceledError } from "./api-client"

import {  } from "../components/code-block"

export { CanceledError }
const getAllBlocks = () => {
    const abortController = new AbortController()
    const req = apiClient.get('codeblock', { signal: abortController.signal })
    return { req, abort: () => abortController.abort() }

}

const getCodeByID = (id) => {
    const abortController = new AbortController();
    const req = apiClient.get(`codeblock/${id}`, { signal: abortController.signal });
    return { req, abort: () => abortController.abort() };
}

export default { getAllBlocks,getCodeByID }