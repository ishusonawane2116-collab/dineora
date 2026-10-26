
import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Volume2,
  Bot,
  Send,
  UtensilsCrossed,
  Sparkles,
  MapPin,
  Clock3,
  ShieldCheck,
  RotateCcw,
  CalendarDays,
  Users,
  CheckCircle2,
  Trash2,
} from "lucide-react";

const starterPrompts = [
  "Suggest a place for a family dinner",
  "Help me choose what to eat",
  "Find vegetarian food ideas",
  "What should I ask a restaurant before visiting?",
];

const STORAGE_KEY = "tabletalk-demo-reservations";

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadReservations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

const emptyForm = {
  name: "",
  phone: "",
  date: "",
  time: "19:00",
  guests: "2",
  occasion: "Casual dining",
  requests: "",
};

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm TableTalk AI 👋 I can help you explore food ideas, plan a meal, and think through restaurant choices. What are you in the mood for?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [reservations, setReservations] = useState(loadReservations);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch {
      // The booking still works in memory if browser storage is unavailable.
    }
  }, [reservations]);

  async function sendMessage(text = input) {
    const content = text.trim();
    if (!content || busy) return;

    setMessages((current) => [
      ...current,
      { role: "user", content },
    ]);
    setInput("");
    setError("");
    setBusy(true);

    try {
      const response = await fetch("http://localhost:3002/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply || "Sorry, I couldn't generate a reply.",
        },
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the AI server. Please check that the backend is running."
      );
    } finally {
      setBusy(false);
    }
  }

  function resetChat() {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! What would you like help with today?",
      },
    ]);
    setError("");
    setInput("");
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setBookingError("");
    setBookingMessage("");
  }

  function createReservation(event) {
    event.preventDefault();
    setBookingError("");
    setBookingMessage("");

    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      setBookingError("Please fill in all required fields.");
      return;
    }

    if (!/^[0-9+\s()-]{7,20}$/.test(form.phone.trim())) {
      setBookingError("Please enter a valid phone number.");
      return;
    }

    if (form.date < getToday()) {
      setBookingError("Please choose today or a future date.");
      return;
    }

    const booking = {
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      requests: form.requests.trim(),
      id: `TT-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "Demo booking",
    };

    setReservations((current) => [booking, ...current]);
    setBookingMessage(
      `Demo booking saved! Your reference is ${booking.id}. This is not a confirmed restaurant reservation.`
    );
    setForm({ ...emptyForm, date: "" });
  }

  function cancelReservation(id) {
    const confirmed = window.confirm(
      "Remove this demo booking from this browser?"
    );
    if (!confirmed) return;

    setReservations((current) => current.filter((item) => item.id !== id));
    setBookingMessage("Demo booking removed.");
    setBookingError("");
  }

  function scrollToBooking() {
    document.getElementById("reservation")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const toggleVoiceInput = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const transcript =
      event.results[0][0].transcript;

    setInput((previous) =>
      previous
        ? `${previous} ${transcript}`
        : transcript
    );
  };

  recognition.onerror = () => {
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.start();
};
const speakReply = (text) => {
  if (!("speechSynthesis" in window)) {
    alert("Voice replies are not supported.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 1;

  window.speechSynthesis.speak(utterance);
};

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="TableTalk AI home">
          <span className="brand-mark">
            <UtensilsCrossed size={22} />
          </span>
          <span>
            TableTalk <b>AI</b>
            <small>YOUR SMART DINING COMPANION</small>
          </span>
        </a>

        <div className="topbar-actions">
          <div className="topbar-status">
            <span className="status-dot" /> AI ASSISTANT
          </div>
          <button
            type="button"
            className="book-nav-button"
            onClick={scrollToBooking}
          >
            <CalendarDays size={16} /> Book a table
          </button>
        </div>
      </header>

      <main className="main-layout">
        <section className="intro-panel">
          <div className="eyebrow">
            <Sparkles size={15} /> A BETTER WAY TO DINE
          </div>

          <h1>
            Good food starts
            <br />
            with a <span>good conversation.</span>
          </h1>

          <p className="intro-copy">
            Your friendly AI companion for food inspiration, restaurant
            questions, and planning your next meal.
          </p>

          <div className="feature-list">
            <div className="feature">
              <span><UtensilsCrossed size={18} /></span>
              <div>
                <b>Food inspiration</b>
                <small>Discover dishes for every craving.</small>
              </div>
            </div>

            <div className="feature">
              <span><MapPin size={18} /></span>
              <div>
                <b>Dining guidance</b>
                <small>Know what to ask before you visit.</small>
              </div>
            </div>

            <div className="feature">
              <span><CalendarDays size={18} /></span>
              <div>
                <b>Table reservation demo</b>
                <small>Enter your details and save a sample booking.</small>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="intro-book-button"
            onClick={scrollToBooking}
          >
            <CalendarDays size={18} /> Reserve your table
          </button>

          <div className="note-card">
            <Clock3 size={17} />
            <span>
              <b>Your next meal, made easier.</b>
              <br />
              Explore food ideas or try the reservation demo below.
            </span>
          </div>
        </section>

        <section className="chat-card" aria-label="TableTalk AI chat">
          <div className="chat-header">
            <div className="assistant-avatar"><Bot size={22} /></div>
            <div className="chat-heading">
              <b>TableTalk Assistant</b>
              <small><span className="status-dot" /> Ready to help</small>
            </div>
            <button
              className="icon-button"
              onClick={resetChat}
              title="Clear chat"
              aria-label="Clear chat"
              type="button"
            >
              <RotateCcw size={17} />
            </button>
          </div>

          <div className="chat-body">
            <div className="date-label">YOUR DINING CONVERSATION</div>

            {messages.map((message, index) => (
              <div
                className={`message-row ${
                  message.role === "user" ? "user-row" : ""
                }`}
                key={`${index}-${message.role}`}
              >
                {message.role === "assistant" && (
                  <div className="mini-avatar"><Bot size={16} /></div>
                )}
                <div
                  className={`bubble ${
                    message.role === "user"
                      ? "user-bubble"
                      : "assistant-bubble"
                  }`}
                >
  <div className="message-content">
    {message.content}
  </div>

  {message.role === "assistant" && (
    <button
      type="button"
      className="voice-reply-button"
      onClick={() => speakReply(message.content)}
      title="Read reply aloud"
      aria-label="Read reply aloud"
    >
      <Volume2 size={18} />
    </button>
  )}
</div>
              </div>
            ))}

            {busy && (
              <div className="message-row">
                <div className="mini-avatar"><Bot size={16} /></div>
                <div className="bubble assistant-bubble typing">
                  TableTalk is thinking <span>•••</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="suggestions">
              <span className="suggestion-title">TRY ASKING</span>
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}<span>↗</span>
                </button>
              ))}
            </div>
          )}

          {error && <div className="error-message" role="alert">{error}</div>}

          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
  value={input}
  onChange={(event) => setInput(event.target.value)}
  placeholder="Ask me anything about food..."
  aria-label="Your message"
  maxLength={2000}
  disabled={busy}
/>

<button
  type="button"
  className={`mic-button ${isListening ? "listening" : ""}`}
  onClick={toggleVoiceInput}
  disabled={busy}
  title="Speak your message"
  aria-label="Speak your message"
>
  <Mic size={20} />
</button>

<button
  type="submit"
  disabled={busy || !input.trim()}
  aria-label="Send message"
>
  <Send size={18} />
</button>
</form>

          <div className="privacy-note">
            <ShieldCheck size={13} />
            Your API key stays on the backend, not in this chat window.
          </div>
        </section>
      </main>

      <section className="reservation-section" id="reservation">
        <div className="reservation-heading">
          <div className="eyebrow">
            <CalendarDays size={15} /> YOUR DINING PLANS
          </div>
          <h2>Reserve your <span>table.</span></h2>
          <p>
            Share your details and create a sample reservation for your
            TableTalk AI project.
          </p>
        </div>

        <div className="reservation-grid">
          <form className="reservation-card" onSubmit={createReservation}>
            <h3><CalendarDays size={21} /> Book a table</h3>
            <p className="form-description">
              Fields marked * are required.
            </p>

            <div className="reservation-fields">
              <label>
                Full name *
                <input
                  name="name"
                  value={form.name}
                  onChange={updateForm}
                  placeholder="Enter your name"
                  autoComplete="name"
                  maxLength={80}
                  required
                />
              </label>

              <label>
                Phone number *
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateForm}
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  maxLength={20}
                  required
                />
              </label>

              <label>
                Reservation date *
                <input
                  name="date"
                  type="date"
                  min={getToday()}
                  value={form.date}
                  onChange={updateForm}
                  required
                />
              </label>

              <label>
                Reservation time *
                <select name="time" value={form.time} onChange={updateForm}>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
              </label>

              <label>
                Number of guests *
                <select
                  name="guests"
                  value={form.guests}
                  onChange={updateForm}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                    <option key={count} value={String(count)}>
                      {count} {count === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Occasion
                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={updateForm}
                >
                  <option>Casual dining</option>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Family dinner</option>
                  <option>Business meeting</option>
                  <option>Other</option>
                </select>
              </label>

              <label className="full-width">
                Special requests (optional)
                <textarea
                  name="requests"
                  value={form.requests}
                  onChange={updateForm}
                  placeholder="Any seating preferences or special requests?"
                  maxLength={500}
                  rows={3}
                />
              </label>
            </div>

            {bookingError && (
              <p className="booking-error" role="alert">{bookingError}</p>
            )}

            {bookingMessage && (
              <div className="booking-success" role="status">
                <CheckCircle2 size={19} />
                <span>{bookingMessage}</span>
              </div>
            )}

            <button type="submit" className="submit-reservation">
              <CalendarDays size={18} /> Save demo reservation
            </button>

            <p className="demo-disclaimer">
              Demo only: this does not contact a restaurant or guarantee a
              table. Your sample bookings are stored in this browser.
            </p>
          </form>

          <aside className="reservation-card bookings-card">
            <div className="bookings-title">
              <div>
                <h3><Users size={21} /> Your demo bookings</h3>
                <p className="form-description">
                  Saved in this browser only.
                </p>
              </div>
              <span className="booking-count">{reservations.length}</span>
            </div>

            {reservations.length === 0 ? (
              <div className="empty-bookings">
                <CalendarDays size={34} />
                <b>No bookings yet</b>
                <p>Complete the form to see your sample reservation here.</p>
              </div>
            ) : (
              <div className="booking-list">
                {reservations.map((booking) => (
                  <article className="booking-item" key={booking.id}>
                    <div className="booking-item-top">
                      <span className="booking-reference">{booking.id}</span>
                      <span className="demo-status">DEMO</span>
                    </div>
                    <h4>{booking.name}</h4>
                    <p>
                      <CalendarDays size={15} />
                      {booking.date} at {booking.time}
                    </p>
                    <p>
                      <Users size={15} />
                      {booking.guests}{" "}
                      {booking.guests === "1" ? "guest" : "guests"}
                      {" · "}{booking.occasion}
                    </p>
                    {booking.requests && (
                      <p className="booking-request">
                        Request: {booking.requests}
                      </p>
                    )}
                    <button
                      className="remove-booking"
                      type="button"
                      onClick={() => cancelReservation(booking.id)}
                    >
                      <Trash2 size={15} /> Remove demo booking
                    </button>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>

      <footer>
        TABLETALK AI <span>•</span> MADE FOR BETTER DINING CONVERSATIONS
      </footer>
    </div>
  );
}
