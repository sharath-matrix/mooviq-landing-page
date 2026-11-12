export type MediaFamilyId =
  | 'transit-vehicle'
  | 'outdoor-ooh'
  | 'indoor-place-based'
  | 'screen-broadcast';

export type AuditWorkflowStatus =
  | 'Field photo workflow'
  | 'Log-based verification (integration required)'
  | 'Custom audit workflow';

export type VerificationModelType =
  | 'physical-static'
  | 'vehicle-branding'
  | 'digital-screen'
  | 'broadcast-log'
  | 'print-edition'
  | 'activation-event';

export interface MediaFamily {
  id: MediaFamilyId;
  code: string;
  label: string;
  shortLabel: string;
  summary: string;
  evidenceModelTitle: string;
  evidenceModelDescription: string;
  defaultStatus: AuditWorkflowStatus;
}

export interface MediaTypeItem {
  id: string;
  name: string;
  familyId: MediaFamilyId;
  verificationModel: VerificationModelType;
  workflowStatus: AuditWorkflowStatus;
  shortNote: string;
  exampleChecklist: string[];
  requiredEvidence: string[];
  caveat?: string;
}

export const MEDIA_FAMILIES: MediaFamily[] = [
  {
    id: 'transit-vehicle',
    code: 'A',
    label: 'Transit & Vehicle',
    shortLabel: 'Transit & Vehicle',
    summary: 'Auto branding, cab fleets, city buses, delivery vans, and wrapped commercial vehicles.',
    evidenceModelTitle: 'Vehicle Branding Audit Model',
    evidenceModelDescription:
      'Captures vehicle ID, required panel photos, wrap condition, and cleanliness checks. Continuous movement or stationary duration analytics require an authorized GPS/telematics integration and are never inferred from a single photo.',
    defaultStatus: 'Field photo workflow',
  },
  {
    id: 'outdoor-ooh',
    code: 'B',
    label: 'Outdoor / OOH',
    shortLabel: 'Outdoor / OOH',
    summary: 'Billboards, hoardings, digital OOH screens, wall paintings, unipoles, pole kiosks, bus shelters, street furniture, and shop boards.',
    evidenceModelTitle: 'Physical Static & DOOH Asset Model',
    evidenceModelDescription:
      'Captures asset ID, site coordinates, installation visibility, correct creative verification, timestamped photos, surrounding condition checks, and issue remediation. Digital OOH combines onsite screen photos with playback logs when integrated.',
    defaultStatus: 'Field photo workflow',
  },
  {
    id: 'indoor-place-based',
    code: 'C',
    label: 'Indoor / Place-Based',
    shortLabel: 'Indoor / Place-Based',
    summary: 'Mall media, retail displays, corporate parks, residential societies, lift lobbies, cinema lobbies, airports, and metro stations.',
    evidenceModelTitle: 'Place-Based & Digital Display Model',
    evidenceModelDescription:
      'Combines onsite installation/screen verification (asset ID, placement sightline, physical condition) with proof-of-play logs for networked indoor digital screens when system integrations are connected.',
    defaultStatus: 'Field photo workflow',
  },
  {
    id: 'screen-broadcast',
    code: 'D',
    label: 'Screen & Broadcast / Other Media',
    shortLabel: 'Screen & Broadcast',
    summary: 'Cinema on-screen ads, radio, television, digital/in-app placements, print editions, and brand activations.',
    evidenceModelTitle: 'Log-Based, Edition & Event Reconciliation Model',
    evidenceModelDescription:
      'Verified through proof-of-play reports, broadcast/delivery logs, publication clippings/edition checks (Print), or venue check-in and setup documentation (Activations) reconciled against booked media plans—not solely photographs.',
    defaultStatus: 'Log-based verification (integration required)',
  },
];

export const MEDIA_CATALOG: MediaTypeItem[] = [
  // A. Transit & Vehicle
  {
    id: 'auto-branding',
    name: 'Auto Branding',
    familyId: 'transit-vehicle',
    verificationModel: 'vehicle-branding',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Back hood, side panels, and interior seat-back creative checks.',
    exampleChecklist: [
      'Registration number readable in frame',
      'Rear hood vinyl free of tears or peeling',
      'Correct campaign creative & tagline visible',
      'Surface cleanliness and legibility acceptable',
    ],
    requiredEvidence: [
      'Rear wide-angle vehicle photo with plate',
      'Close-up creative check photo',
      'Auditor timestamp & checkpoint location string',
    ],
    caveat: 'Single checkpoint photos verify physical installation at audit time; route movement requires separate telematics integration.',
  },
  {
    id: 'cab-branding',
    name: 'Cab Branding',
    familyId: 'transit-vehicle',
    workflowStatus: 'Field photo workflow',
    verificationModel: 'vehicle-branding',
    shortNote: 'Door wraps, rear windshield decals, and roof-top light boxes.',
    exampleChecklist: [
      'Vehicle registration & fleet ID recorded',
      'Left and right door panel wraps intact',
      'Roof display illuminated / securely mounted',
      'No competing decal overlap or fade',
    ],
    requiredEvidence: [
      'Left side-profile vehicle photo',
      'Right side-profile vehicle photo',
      'Registration plate verification capture',
    ],
    caveat: 'Fleet active-hours telemetry requires authorized aggregator or GPS device integration.',
  },
  {
    id: 'bus-branding',
    name: 'Bus Branding',
    familyId: 'transit-vehicle',
    verificationModel: 'vehicle-branding',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Full bus wraps, side panels, and depot dispatch checks.',
    exampleChecklist: [
      'Depot / route code and bus number matched',
      'Full lateral panel vinyl alignment checked',
      'No window perforation obstruction violation',
    ],
    requiredEvidence: [
      'Curb-side & road-side full vehicle photos',
      'Depot check-in timestamp and route tag',
    ],
  },
  {
    id: 'delivery-vans',
    name: 'Delivery Vans',
    familyId: 'transit-vehicle',
    verificationModel: 'vehicle-branding',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Last-mile logistics box wraps and commercial van panels.',
    exampleChecklist: [
      'Container left/right/rear wrap intact',
      'Hub or fulfillment center check-in verified',
      'Cleanliness & paint surface condition OK',
    ],
    requiredEvidence: [
      '3-side wrap inspection photos',
      'Vehicle plate & hub reference log',
    ],
  },
  {
    id: 'fleet-wraps',
    name: 'Fleet / Vehicle Wraps',
    familyId: 'transit-vehicle',
    verificationModel: 'vehicle-branding',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Multi-city commercial fleet branding across mixed vehicle classes.',
    exampleChecklist: [
      'Asset fleet ID matched to roster',
      'Creative batch version validated',
      'Edge sealing & corner wear inspected',
    ],
    requiredEvidence: [
      'Multi-angle wrap photos',
      'Vehicle ID & inspection status record',
    ],
  },
  {
    id: 'other-transit',
    name: 'Other Transit Placements',
    familyId: 'transit-vehicle',
    verificationModel: 'vehicle-branding',
    workflowStatus: 'Custom audit workflow',
    shortNote: 'E-rickshaws, metro shuttle buses, mobile LED vans, and rail exterior.',
    exampleChecklist: [
      'Unit identifier verified against plan',
      'Power/display check (for mobile LED vans)',
      'Branding integrity check across panels',
    ],
    requiredEvidence: [
      'Unit-level checkpoint photos',
      'Custom route or hub verification notes',
    ],
  },

  // B. Outdoor / OOH
  {
    id: 'billboards-hoardings',
    name: 'Billboards / Hoardings',
    familyId: 'outdoor-ooh',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Large-format road-facing hoardings, gantry displays, and building wraps.',
    exampleChecklist: [
      'Site ID & facing direction verified',
      'Unobstructed vehicular sightline (trees/wires clear)',
      'Vinyl tension clean without sag or tear',
      'Night illumination floodlights functioning',
    ],
    requiredEvidence: [
      'Approach-angle sightline photo',
      'Close-up creative verification photo',
      'Evening illumination photo (where lit)',
    ],
  },
  {
    id: 'digital-ooh',
    name: 'Digital OOH Screens',
    familyId: 'outdoor-ooh',
    verificationModel: 'digital-screen',
    workflowStatus: 'Log-based verification (integration required)',
    shortNote: 'Outdoor LED walls and highway digital boards.',
    exampleChecklist: [
      'Screen LED modules free of dead pixel blocks',
      'Creative displaying cleanly in rotation',
      'Onsite check cross-matched with CMS playback log',
    ],
    requiredEvidence: [
      'Onsite screen display photo/clip',
      'CMS proof-of-play log export (integration required)',
    ],
    caveat: 'Uptime percentage claims require CMS/player log integration; onsite visits capture point-in-time status.',
  },
  {
    id: 'wall-paintings',
    name: 'Wall Paintings',
    familyId: 'outdoor-ooh',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Highway, semi-urban, and market-wall painted brand murals.',
    exampleChecklist: [
      'Wall dimensions & artwork fidelity checked',
      'Brand colors & phone/CTA legible',
      'No poster pasting or weather damage over mural',
    ],
    requiredEvidence: [
      'Wide landmark context photo',
      'Straight-on painted wall photo',
    ],
  },
  {
    id: 'unipoles',
    name: 'Unipoles',
    familyId: 'outdoor-ooh',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Single-column arterial road and expressway overhead structures.',
    exampleChecklist: [
      'Traffic-facing side creative verified',
      'Structure & lighting arm intact',
      'Location matches permitted corridor',
    ],
    requiredEvidence: [
      'Traffic-view approach photo',
      'Site location coordinate tag',
    ],
  },
  {
    id: 'pole-kiosks',
    name: 'Pole Kiosks',
    familyId: 'outdoor-ooh',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Sequential street-light pole boxes along commercial corridors.',
    exampleChecklist: [
      'Pole sequence count matches booking',
      'Kiosk frame alignment straight',
      'No missing or damaged boxes in stretch',
    ],
    requiredEvidence: [
      'Corridor stretch sequence photos',
      'Sample close-up creative captures',
    ],
  },
  {
    id: 'bus-shelters',
    name: 'Bus Shelters',
    familyId: 'outdoor-ooh',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Backlit shelter panels, side mupis, and commuter seating bays.',
    exampleChecklist: [
      'Backlight uniform across panel',
      'Acrylic glass intact & clean',
      'Surrounding waste/encroachment check',
    ],
    requiredEvidence: [
      'Full shelter context photo',
      'Lit panel condition photo',
    ],
  },
  {
    id: 'street-furniture',
    name: 'Street Furniture',
    familyId: 'outdoor-ooh',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Public utility kiosks, benches, wayfinding totems, and bike docks.',
    exampleChecklist: [
      'Asset ID matched to municipal zone',
      'Graphic panel undamaged and legible',
      'Surrounding visibility unobstructed',
    ],
    requiredEvidence: [
      'Installed asset photo with surroundings',
      'Exception note if vandalism/obstruction present',
    ],
  },
  {
    id: 'shop-name-boards',
    name: 'Shop Name Boards',
    familyId: 'outdoor-ooh',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Dealer boards, distributor fascia signage, and GSB installations.',
    exampleChecklist: [
      'Outlet name & dealer ID matched',
      'Flex/acrylic board properly mounted',
      'Backlit signage operational (if illuminated)',
    ],
    requiredEvidence: [
      'Storefront wide photo showing dealer fascia',
      'Shop verification checkpoint record',
    ],
  },

  // C. Indoor / Place-Based
  {
    id: 'mall-media',
    name: 'Mall Media',
    familyId: 'indoor-place-based',
    verificationModel: 'digital-screen',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Atrium drop-downs, pillar wraps, escalator branding, and digital totems.',
    exampleChecklist: [
      'Mall wing / level matches booking',
      'Creative playing cleanly (digital) or wrapped neatly (static)',
      'Zero structural damage or crowd blockage',
    ],
    requiredEvidence: [
      'Atrium/corridor context photo',
      'Close-up display photo + CMS log (if digital)',
    ],
  },
  {
    id: 'retail-store-displays',
    name: 'Retail / Store Displays',
    familyId: 'indoor-place-based',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'End-cap gondolas, checkout branding, and modern trade display units.',
    exampleChecklist: [
      'Store code verified',
      'POSM/display positioned in contracted aisle',
      'Brand creative clean and stocked',
    ],
    requiredEvidence: [
      'Aisle context photo',
      'Close-up display placement photo',
    ],
  },
  {
    id: 'corporate-parks',
    name: 'Corporate Parks',
    familyId: 'indoor-place-based',
    verificationModel: 'digital-screen',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Campus turnstiles, food court digital walls, and tower lobbies.',
    exampleChecklist: [
      'Campus & building tower matched',
      'Screen brightness & playback confirmed',
      'Static standee/wrap placement clean',
    ],
    requiredEvidence: [
      'Lobby/cafeteria display photo',
      'Facility check-in timestamp',
    ],
  },
  {
    id: 'residential-societies',
    name: 'Residential Societies',
    familyId: 'indoor-place-based',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Society gate branding, noticeboards, and clubhouse displays.',
    exampleChecklist: [
      'Society name & tower verified',
      'Noticeboard/standee placed in designated zone',
      'Creative current for active campaign window',
    ],
    requiredEvidence: [
      'Tower/society context photo',
      'Noticeboard/gate creative close-up',
    ],
  },
  {
    id: 'lift-lobbies',
    name: 'Lift Lobbies',
    familyId: 'indoor-place-based',
    verificationModel: 'digital-screen',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Elevator digital frames and static lobby posters.',
    exampleChecklist: [
      'Building & wing tower ID matched',
      'Screen powered on with active loop',
      'Frame undamaged and clear of glare',
    ],
    requiredEvidence: [
      'Lobby wall context photo',
      'Close-up display capture (or player log)',
    ],
  },
  {
    id: 'cinema-lobby-assets',
    name: 'Cinema Lobby Assets',
    familyId: 'indoor-place-based',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Concession standees, backlit foyer panels, and digital lobby posters.',
    exampleChecklist: [
      'Multiplex property & foyer area matched',
      'Standee upright in high-footfall spot',
      'Backlit panel illumination working',
    ],
    requiredEvidence: [
      'Foyer placement wide photo',
      'Close-up creative & illumination check',
    ],
  },
  {
    id: 'airports',
    name: 'Airports',
    familyId: 'indoor-place-based',
    verificationModel: 'digital-screen',
    workflowStatus: 'Custom audit workflow',
    shortNote: 'Terminal baggage claim digital walls, aerobridge wraps, and departures lightboxes.',
    exampleChecklist: [
      'Terminal / concourse asset ID matched',
      'Display illumination & loop verification',
      'Concessionaire compliance clearance noted',
    ],
    requiredEvidence: [
      'Authorized inspection photo or concessionaire report',
      'Playback log export (for digital walls)',
    ],
    caveat: 'Airside and restricted terminal zones require authorized airport personnel or partner log submissions.',
  },
  {
    id: 'metro-stations',
    name: 'Metro / Station Placements',
    familyId: 'indoor-place-based',
    verificationModel: 'physical-static',
    workflowStatus: 'Field photo workflow',
    shortNote: 'Platform screen doors, concourse pillars, AFC gates, and train wraps.',
    exampleChecklist: [
      'Station name & concourse/platform level verified',
      'Static vinyl or digital panel clean and active',
      'No commuter obstruction or damage',
    ],
    requiredEvidence: [
      'Station identifier + placement photo',
      'Creative clarity check capture',
    ],
  },

  // D. Screen & Broadcast / Other Media
  {
    id: 'cinema-on-screen',
    name: 'Cinema On-Screen Ads',
    familyId: 'screen-broadcast',
    verificationModel: 'broadcast-log',
    workflowStatus: 'Log-based verification (integration required)',
    shortNote: 'Pre-show and interval auditorium screen spots across multiplex chains.',
    exampleChecklist: [
      'Property, auditorium & show slot reconciled',
      'Delivered spot count matched to booked plan',
      'Creative version ID verified in playout log',
    ],
    requiredEvidence: [
      'Multiplex server proof-of-play log export',
      'Plan vs delivered spot reconciliation sheet',
    ],
    caveat: 'Requires theater playout log ingestion; photographs alone cannot validate full multi-show spot counts.',
  },
  {
    id: 'radio',
    name: 'Radio',
    familyId: 'screen-broadcast',
    verificationModel: 'broadcast-log',
    workflowStatus: 'Log-based verification (integration required)',
    shortNote: 'RJ mentions, timed audio spots, and station roadblock schedules.',
    exampleChecklist: [
      'Station frequency, city & daypart verified',
      'Aired spot duration matched to RO',
      'Broadcast certificate reconciled with schedule',
    ],
    requiredEvidence: [
      'Station broadcast / transmission log',
      'Signed station log & audio snippet reference (when supplied)',
    ],
  },
  {
    id: 'television',
    name: 'Television',
    familyId: 'screen-broadcast',
    verificationModel: 'broadcast-log',
    workflowStatus: 'Log-based verification (integration required)',
    shortNote: 'Linear broadcast spots, Aston bands, and sponsorship tags.',
    exampleChecklist: [
      'Channel, timeband & program slot checked',
      'Spot duration & creative code verified',
      'Make-good / missed spots flagged in report',
    ],
    requiredEvidence: [
      'As-run broadcast monitoring / channel log',
      'Plan vs actual reconciliation schedule',
    ],
  },
  {
    id: 'digital-in-app',
    name: 'Digital / In-App Ads',
    familyId: 'screen-broadcast',
    verificationModel: 'broadcast-log',
    workflowStatus: 'Log-based verification (integration required)',
    shortNote: 'CTV, OTT pre-rolls, publisher banners, and app-open placements.',
    exampleChecklist: [
      'Publisher delivery report reconciled with IO',
      'Impression / slot delivery variance checked',
      'Screenshot proof of live placement attached',
    ],
    requiredEvidence: [
      'Ad-server / publisher delivery log CSV',
      'Sample placement capture & reconciliation note',
    ],
  },
  {
    id: 'print-media',
    name: 'Print Media',
    familyId: 'screen-broadcast',
    verificationModel: 'print-edition',
    workflowStatus: 'Custom audit workflow',
    shortNote: 'Newspaper jacket ads, regional editions, inserts, and trade magazines.',
    exampleChecklist: [
      'Publication name & city edition verified',
      'Publish date, page number & position checked',
      'Print dimensions & color clarity validated',
    ],
    requiredEvidence: [
      'Scanned edition clipping / tear-sheet showing masthead & date',
      'Insertion order reconciliation record',
    ],
  },
  {
    id: 'activations-events',
    name: 'Activation / Event Campaigns',
    familyId: 'screen-broadcast',
    verificationModel: 'activation-event',
    workflowStatus: 'Custom audit workflow',
    shortNote: 'BTL mall kiosks, college fests, RWA pop-ups, and roadshow vans.',
    exampleChecklist: [
      'Venue setup completed by scheduled start time',
      'Promoter staffing & branded uniform verified',
      'Backdrop branding & collateral inventory present',
    ],
    requiredEvidence: [
      'Venue setup photo + staff check-in timestamp',
      'Activity attendance / sample distribution summary',
    ],
  },
];

export const VERIFICATION_MODEL_CARDS = [
  {
    model: 'Physical Static Placement',
    formats: 'Billboards, Unipoles, Wall Paintings, Shop Boards, Bus Shelters',
    method: 'Asset ID, site coordinates, installation/visibility, creative check, timestamped photos, surrounding condition, and issue remediation.',
    status: 'Field photo workflow' as AuditWorkflowStatus,
  },
  {
    model: 'Vehicle Branding',
    formats: 'Autos, Cabs, Buses, Delivery Vans, Fleet Wraps',
    method: 'Vehicle ID, required multi-panel photos, wrap integrity & cleanliness. Route/stationary analytics only with authorized GPS/telematics integration.',
    status: 'Field photo workflow' as AuditWorkflowStatus,
  },
  {
    model: 'Digital Screen / DOOH',
    formats: 'DOOH Walls, Mall Digital, Lift Screens, Corporate & Airport Screens',
    method: 'Onsite physical screen condition checks paired with CMS playback / proof-of-play logs when connected; uptime relies on system data.',
    status: 'Log-based verification (integration required)' as AuditWorkflowStatus,
  },
  {
    model: 'Broadcast / Cinema / In-App',
    formats: 'Cinema On-Screen, Radio, Television, Digital / In-App',
    method: 'Proof-of-play, broadcast transmission logs, delivery reports, and booking plan reconciliation—never misrepresented as photo-only verification.',
    status: 'Log-based verification (integration required)' as AuditWorkflowStatus,
  },
  {
    model: 'Print Editions',
    formats: 'Newspapers, Supplements, Magazines, Inserts',
    method: 'Publication title, city edition, publish date, tear-sheet / clipping evidence, and insertion order reconciliation.',
    status: 'Custom audit workflow' as AuditWorkflowStatus,
  },
  {
    model: 'Activations & BTL Events',
    formats: 'Mall Pop-Ups, RWA Events, Campus Activations, Roadshows',
    method: 'Venue readiness, setup photography, promoter check-in records, and structured activity logs.',
    status: 'Custom audit workflow' as AuditWorkflowStatus,
  },
];
