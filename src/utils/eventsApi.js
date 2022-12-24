import { EventSourcePolyfill } from "event-source-polyfill";
import { FireGetToken } from "@/utils/firebase.js";

const EventSource = EventSourcePolyfill;

class EventSourceApi {
  constructor() {
    this.eventSource = null;
  }

  async connect() {
    this.eventSource = new EventSource(
      `${process.env.VUE_APP_BASE_URL}/events/stream`,
      {
        headers: {
          Authorization: `Bearer ${await FireGetToken()}`,
        },
      },
    );
    await this.handler();
  }
  async handler() {
    this.eventSource.addEventListener("update-tickers", event => {
      console.log(event.data);
    });

    this.eventSource.onerror = error => {
      if (error.status === 401) {
        console.log("Unauthorized eventsource");
        this.eventSource.close();
        this.connect();
      }
      console.error(error);
    };
  }
}
const eventSourceApi = new EventSourceApi();
export default eventSourceApi;
