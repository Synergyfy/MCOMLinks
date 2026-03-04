// Engagement Tracker — PRD STEP 8
// Logs every frontfacing interaction in the background
// In production, this would send to an analytics backend

export type EventType = 'scan' | 'offer_view' | 'cta_click' | 'form_submit' | 'redemption' | 'redirect'

export interface TrackingEvent {
    id: string
    type: EventType
    locationId: string
    offerId: string
    sessionId: string
    timestamp: string
    metadata?: Record<string, string>
}

// In-memory event log (production: database/analytics service)
const eventLog: TrackingEvent[] = []

let eventCounter = 0

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
    }

    eventLog.forEach((event) => {
        counts[event.type]++
    })

    return counts
}
