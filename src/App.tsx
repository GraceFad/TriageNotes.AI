import React, { useState } from 'react';
import { 
  Activity, 
  ClipboardList, 
  Stethoscope, 
  Thermometer, 
  Heart, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { AudioRecorder } from './components/AudioRecorder';
import { transcribeAndExtract, EHRData } from './services/gemini';
import { cn } from './lib/utils';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [ehrData, setEhrData] = useState<EHRData | null>(null);
  const [showTranscription, setShowTranscription] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecordingComplete = async (blob: Blob) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await transcribeAndExtract(blob);
      setTranscription(result.transcription);
      setEhrData(result.ehrData);
    } catch (err) {
      console.error('Processing error:', err);
      setError('Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority.includes('Level 1')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (priority.includes('Level 2')) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    if (priority.includes('Level 3')) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    if (priority.includes('Level 4')) return 'text-green-500 bg-green-500/10 border-green-500/20';
    return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#FF4444] selection:text-white">
      {/* Header */}
      <header className="border-b border-[#141414]/10 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#141414] rounded-lg flex items-center justify-center">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg leading-none">TriageNotes AI</h1>
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">Medical Scribe v1.0</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#141414]/10 rounded-full text-xs font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Ready
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Recording & Status */}
        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-[2px] opacity-50 px-1">Triage Input</h2>
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete} 
              isProcessing={isProcessing} 
            />
          </section>

          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white rounded-2xl border border-[#141414]/10 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-spin text-[#FF4444]" />
                <span className="font-medium text-sm">Processing session...</span>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-[#E4E3E0] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="h-full w-1/3 bg-[#FF4444]"
                  />
                </div>
                <p className="text-[11px] font-mono text-[#8E9299]">
                  Analyzing audio, extracting vitals, and generating EHR data...
                </p>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-600 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <section className="p-6 bg-white/40 rounded-2xl border border-[#141414]/5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Session Guidelines
            </h3>
            <ul className="text-xs space-y-3 text-[#141414]/70 font-medium">
              <li className="flex gap-2">
                <span className="text-[#FF4444]">•</span>
                Ensure clear audio capture of both nurse and patient.
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF4444]">•</span>
                Verbally state vitals (BP, Temp, HR) for better accuracy.
              </li>
              <li className="flex gap-2">
                <span className="text-[#FF4444]">•</span>
                Mention allergies and current medications clearly.
              </li>
            </ul>
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {!ehrData && !isProcessing ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] border-2 border-dashed border-[#141414]/10 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-6"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#141414]/5">
                  <ClipboardList className="w-10 h-10 opacity-20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">No Active Session</h3>
                  <p className="text-[#141414]/50 max-w-xs mx-auto text-sm leading-relaxed">
                    Start a recording to begin transcribing and extracting EHR data for your patient triage.
                  </p>
                </div>
              </motion.div>
            ) : ehrData ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Triage Summary Card */}
                <div className="bg-white rounded-3xl border border-[#141414]/10 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-[#141414]/5 flex flex-wrap items-start justify-between gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-50">
                        <User className="w-3 h-3" />
                        Patient Triage Summary
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">{ehrData.chiefComplaint}</h3>
                    </div>
                    <div className={cn(
                      "px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 shadow-sm",
                      getPriorityColor(ehrData.triagePriority)
                    )}>
                      <AlertTriangle className="w-4 h-4" />
                      {ehrData.triagePriority}
                    </div>
                  </div>
                  <div className="p-8 bg-[#F9F9F8]">
                    <p className="text-lg font-medium leading-relaxed italic text-[#141414]/80">
                      "{ehrData.summary}"
                    </p>
                  </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <VitalCard 
                    label="Temp" 
                    value={ehrData.vitals.temperature || '--'} 
                    unit="°F" 
                    icon={<Thermometer className="w-4 h-4" />} 
                  />
                  <VitalCard 
                    label="BP" 
                    value={ehrData.vitals.bloodPressure || '--'} 
                    unit="mmHg" 
                    icon={<Activity className="w-4 h-4" />} 
                  />
                  <VitalCard 
                    label="HR" 
                    value={ehrData.vitals.heartRate || '--'} 
                    unit="bpm" 
                    icon={<Heart className="w-4 h-4" />} 
                  />
                  <VitalCard 
                    label="RR" 
                    value={ehrData.vitals.respiratoryRate || '--'} 
                    unit="br/m" 
                    icon={<Wind className="w-4 h-4" />} 
                  />
                  <VitalCard 
                    label="SpO2" 
                    value={ehrData.vitals.oxygenSaturation || '--'} 
                    unit="%" 
                    icon={<Droplets className="w-4 h-4" />} 
                  />
                </div>

                {/* Main EHR Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DataSection 
                    title="History of Present Illness" 
                    icon={<Stethoscope className="w-4 h-4" />}
                    content={ehrData.historyOfPresentIllness}
                  />
                  <DataSection 
                    title="Recommended Action" 
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    content={ehrData.recommendedAction}
                    highlight
                  />
                </div>

                {/* Lists */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ListSection title="Allergies" items={ehrData.allergies} color="red" />
                  <ListSection title="Medications" items={ehrData.medications} color="blue" />
                  <ListSection title="Past Medical History" items={ehrData.pastMedicalHistory} color="gray" />
                </div>

                {/* Transcription Toggle */}
                <div className="border-t border-[#141414]/10 pt-8">
                  <button 
                    onClick={() => setShowTranscription(!showTranscription)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-[#FF4444] transition-colors"
                  >
                    {showTranscription ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {showTranscription ? 'Hide' : 'Show'} Full Transcription
                  </button>
                  
                  <AnimatePresence>
                    {showTranscription && transcription && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 p-8 bg-white rounded-3xl border border-[#141414]/10 font-mono text-sm leading-relaxed text-[#141414]/70">
                          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#141414]/5 text-[#141414]">
                            <FileText className="w-4 h-4" />
                            <span className="font-bold uppercase tracking-wider text-[10px]">Verbatim Audio Log</span>
                          </div>
                          <ReactMarkdown>{transcription}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#141414]/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-30">
          <Activity className="w-3 h-3" />
          HIPAA Compliant AI Processing
        </div>
        <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest opacity-30">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Support</a>
        </div>
      </footer>
    </div>
  );
}

function VitalCard({ label, value, unit, icon }: { label: string, value: string, unit: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#141414]/10 shadow-sm space-y-2">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-40">
        {icon}
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold tracking-tight">{value}</span>
        <span className="text-[10px] font-mono opacity-40">{unit}</span>
      </div>
    </div>
  );
}

function DataSection({ title, icon, content, highlight }: { title: string, icon: React.ReactNode, content: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "p-8 rounded-3xl border shadow-sm space-y-4",
      highlight ? "bg-[#141414] text-white border-[#141414]" : "bg-white border-[#141414]/10"
    )}>
      <h4 className={cn(
        "text-xs font-bold uppercase tracking-widest flex items-center gap-2",
        highlight ? "text-white/50" : "text-[#141414]/50"
      )}>
        {icon}
        {title}
      </h4>
      <p className="text-sm font-medium leading-relaxed">
        {content}
      </p>
    </div>
  );
}

function ListSection({ title, items, color }: { title: string, items: string[], color: 'red' | 'blue' | 'gray' }) {
  const colors = {
    red: 'bg-red-500/10 text-red-700 border-red-500/20',
    blue: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    gray: 'bg-gray-500/10 text-gray-700 border-gray-500/20'
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#141414]/10 shadow-sm space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-[#141414]/50">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items && items.length > 0 ? items.map((item, i) => (
          <span key={i} className={cn("px-2 py-1 rounded-md text-[11px] font-bold border", colors[color])}>
            {item}
          </span>
        )) : (
          <span className="text-[11px] font-mono opacity-30 italic">None recorded</span>
        )}
      </div>
    </div>
  );
}
