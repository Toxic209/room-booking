import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const emptyForm = { roomNo: '', guestName: '', checkIn: '', checkOut: '' };

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function App() {
  // --- State Variables ---
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  // --- Fetch bookings on every reload/change --- 
  useEffect(() => {
    fetch(`${API_URL}/bookings`)
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load bookings');
        return response.json();
      })
      .then(setBookings)
      .catch((error) => setNotice({ type: 'error', text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  // --- Handlers ---

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEditing(booking) {
    setEditingId(booking._id);
    setForm({
      roomNo: booking.roomNo,
      guestName: booking.guestName,
      checkIn: booking.checkIn.slice(0, 10),
      checkOut: booking.checkOut.slice(0, 10),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setNotice({ type: '', text: '' });
    const isEditing = Boolean(editingId);
    try {
      const response = await fetch(`${API_URL}/bookings${isEditing ? `/${editingId}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to save booking');
      setBookings(isEditing ? bookings.map((item) => (item._id === editingId ? data : item)) : [data, ...bookings]);
      resetForm();
      setNotice({ type: 'success', text: isEditing ? 'Booking updated' : 'Booking confirmed' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function removeBooking(id) {
    if (!window.confirm('Remove this booking?')) return;
    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Unable to remove booking');
      }
      setBookings(bookings.filter((item) => item._id !== id));
      setNotice({ type: 'success', text: 'Booking removed' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    }
  }

  // ----------------------------------------------------------

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#1c2b2a]">

      {/* Header Starts */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8e85a] text-sm font-extrabold text-[#1c2b2a] 
          shadow-sm">SW</div>
          <span className="font-display text-xl font-bold tracking-tight">staywise</span>
        </div>
        <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#71807b] sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#8ea449]" /> Front desk workspace</div>
      </header>
      {/* Header Ends */}

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-8 lg:px-10 lg:pt-16">
        {/* Hero Starts */}
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#8ea449]">Reservations / 2026</p>
          <h1 className="font-display text-5xl font-bold leading-[0.98] 
          tracking-[-0.04em] text-[#1c2b2a] sm:text-6xl">A calmer way to<br />
            <span className="text-[#8a9790]">manage every stay.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#687570]">Keep arrivals, departures, and guest details in one clear view.</p>
        </div>
        {/* Hero Ends */}

        {/* popup starts */}
        {notice.text && <div
          className={`mb-6 flex items-center gap-3 rounded-xl border 
          px-4 py-3 text-sm font-semibold ${notice.type === 'error' ?
              'border-[#e4b9b0] bg-[#fff3f0] text-[#a34e40]' :
              'border-[#cbdc92] bg-[#f2f7d9] text-[#60752e]'}`}>
          <span className="font-extrabold">{notice.type === 'error' ? '!' : 'OK'}</span>
          {notice.text}
          <button className="ml-auto text-lg leading-none" onClick={() =>
            setNotice({ type: '', text: '' })} aria-label="Dismiss notification">x</button>
        </div>}
        {/* popup ends */}

        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.5fr]">
          {/* Booking Form Starts */}
          <form onSubmit={handleSubmit} className="rounded-2xl bg-[#1c2b2a] p-6 text-white shadow-[0_16px_40px_rgba(28,43,42,0.12)] sm:p-8">
            <div className="mb-8 flex items-start justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#d8e85a]">{editingId ? 'Edit reservation' : 'New reservation'}</p><h2 className="font-display text-2xl font-bold">{editingId ? 'Update the stay' : 'Book a room'}</h2></div><span className="text-xs font-bold uppercase tracking-[0.12em] text-[#d8e85a]">Dates</span></div>
            <div className="space-y-5">
              <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#aebbb5]">Guest name</span><input required name="guestName" value={form.guestName} onChange={handleChange} placeholder="e.g. Maya Singh" className="field-dark" /></label>
              <label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#aebbb5]">Room number</span><input required name="roomNo" value={form.roomNo} onChange={handleChange} placeholder="e.g. 204" className="field-dark" /></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#aebbb5]">Check-in</span><input required type="date" name="checkIn" value={form.checkIn} onChange={handleChange} className="field-dark" /></label><label className="block"><span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-[#aebbb5]">Check-out</span><input required type="date" name="checkOut" value={form.checkOut} onChange={handleChange} className="field-dark" /></label></div>
            </div>
            <div className="mt-8 flex gap-3">
              <button disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d8e85a] 
              px-4 py-3.5 text-sm font-extrabold text-[#1c2b2a] transition hover:bg-[#e4f276] disabled:cursor-wait 
              disabled:opacity-60">{editingId ? 'OK' : '+'}
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Confirm booking'}</button>
              {editingId && <button type="button" onClick={resetForm} className="rounded-xl 
              border border-[#526360] px-4 text-[#c8d1cc] transition hover:bg-[#2b3d3a]" aria-label="Cancel editing">x</button>}
            </div>
          </form>
          {/* Booking Form Ends */}

          {/* Display Board Starts */}
          <section className="min-w-0">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a9790]">Live overview</p>
                <h2 className="mt-1 font-display text-2xl font-bold">Upcoming stays
                  <span className="ml-1 align-middle text-sm font-semibold text-[#8a9790]">{bookings.length}</span></h2></div>
              <div className="hidden items-center gap-1 text-xs font-bold text-[#8a9790] sm:flex">All bookings
                <span aria-hidden="true">&gt;</span></div></div>
            <div className="overflow-hidden rounded-2xl border border-[#deddd5] bg-white">
              {loading ? <div className="p-10 text-center text-sm text-[#78847f]">Loading reservations...</div>
                : bookings.length === 0 ?
                  <div className="p-12 text-center">
                    <div className="mx-auto mb-3 text-2xl font-bold text-[#b6c288]">--</div>
                    <p className="font-display font-bold">No bookings yet</p>
                    <p className="mt-1 text-sm text-[#78847f]">Your next reservation will appear here.</p>
                  </div>
                  :
                  <div className="divide-y divide-[#ecebe5]">{bookings.map((booking) =>
                    <article key={booking._id} className="group flex flex-col gap-4 p-5 
                  transition hover:bg-[#fbfbf7] sm:flex-row sm:items-center sm:justify-between 
                  sm:p-6">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center 
                        justify-center rounded-xl bg-[#edf1d9] font-display 
                        text-sm font-extrabold text-[#65772e]">{booking.roomNo}
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate font-display font-bold">
                            {booking.guestName}</h3>
                          <p className="mt-1 text-sm text-[#7a8580]">
                            {formatDate(booking.checkIn)}
                            <span className="px-1 text-[#b8c0bb]">to</span>
                            {formatDate(booking.checkOut)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center 
                      justify-between gap-4 sm:justify-end">
                        <span className="rounded-full bg-[#f1f4ec] 
                      px-3 py-1.5 text-xs font-bold text-[#65772e]">Confirmed</span>

                        <div className="flex 
                      gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                          <button onClick={() => startEditing(booking)} className="icon-button"
                            aria-label={`Edit ${booking.guestName}`}>edit</button>
                          <button onClick={
                            () => removeBooking(booking._id)}
                            className="icon-button text-[#a34e40] hover:bg-[#fff0ed]"
                            aria-label={`Delete ${booking.guestName}`}>delete
                          </button>
                        </div>

                      </div>
                    </article>)}
                  </div>}
            </div>
          </section>
          {/* Display Board Starts */}
        </div>
      </section>
    </main>
  );
}

export default App;
