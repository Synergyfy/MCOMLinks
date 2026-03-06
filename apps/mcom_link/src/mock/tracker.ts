// Engagement Tracker — PRD STEP 8
// Logs every frontfacing interaction in the background
// In production, this would send to an analytics backend

export type EventType = 'scan' | 'offer_view' | 'cta_click' | 'form_submit' | 'redemption' | 'redirect' | 'directions' | 'save_to_phone' | 'call_click' | 'whatsapp_click' | 'quick_claim' | 'engagement_time'

export interface TrackingEvent {
    id: string
    type: EventType
    locationId: string
    offerId: string
    sessionId: string
    timestamp: string
    metadata?: Record<string, string>
}

// In-memory event log backed by localStorage
const getStoredEvents = (): TrackingEvent[] => {
    const stored = localStorage.getItem('mcom_event_log')
    return stored ? JSON.parse(stored) : []
}

let eventLog: TrackingEvent[] = getStoredEvents()

let eventCounter = eventLog.length

function generateEventId(): string {
    eventCounter++
    return `evt-${Date.now()}-${eventCounter}`
}

/**
 * Generate a simple session ID from browser fingerprint
 * In production, use a proper session management system
 */
export function getSessionId(): string {
    let sessionId = sessionStorage.getItem('mcom_session_id')
    if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
        sessionStorage.setItem('mcom_session_id', sessionId)
    }
    return sessionId
}

/**
 * Track an engagement event
 * Called silently in the background — customer never sees it
 */
export function trackEvent(
    type: EventType,
    locationId: string,
    offerId: string,
    metadata?: Record<string, string>
): void {
    const event: TrackingEvent = {
        id: generateEventId(),
        type,
        locationId,
        offerId,
        sessionId: getSessionId(),
        timestamp: new Date().toISOString(),
        metadata,
    }

    eventLog.push(event)
    localStorage.setItem('mcom_event_log', JSON.stringify(eventLog))

    // Console log in dev for visibility (invisible in production)
    if (import.meta.env.DEV) {
        console.log(`[MCOM Tracker] ${type}`, { locationId, offerId, metadata })
    }
}

/**
 * Get all events (for debugging / dev tools)
 */
export function getEventLog(): TrackingEvent[] {
    return [...eventLog]
}

/**
 * Get specific stats for an offer
 */
export function getOfferStats(offerId: string) {
    const scans = eventLog.filter(e => e.offerId === offerId && e.type === 'scan').length
    const clicks = eventLog.filter(e => e.offerId === offerId && (e.type === 'cta_click' || e.type === 'offer_view')).length
    return { scans, clicks }
}

/**
 * Get event count by type (for debugging)
 */
export function getEventCounts(): Record<EventType, number> {
    const counts: Record<EventType, number> = {
        scan: 0,
        offer_view: 0,
        cta_click: 0,
        form_submit: 0,
        redemption: 0,
        redirect: 0,
        directions: 0,
        save_to_phone: 0,
        call_click: 0,
        whatsapp_click: 0,
        quick_claim: 0,
        engagement_time: 0
    }

    eventLog.forEach((event) => {
        counts[event.type]++
    })

    return counts
}
