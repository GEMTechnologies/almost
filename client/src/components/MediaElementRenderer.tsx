import React, { useState } from 'react';
import { MediaElement } from '../services/mediaProposalGenerator';
import { Camera, PieChart, BarChart3, Table, Users, TrendingUp, Play, Clock, MapPin, Calendar, ChevronRight, ChevronDown, FileText, Monitor, BarChart, Box, GitBranch, Calendar as CalendarIcon } from 'lucide-react';

interface MediaElementRendererProps {
  mediaElement: MediaElement;
  className?: string;
}

const MediaElementRenderer: React.FC<MediaElementRendererProps> = ({ mediaElement, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const renderChart = () => {
    if (mediaElement.content.type === 'pie') {
      return renderPieChart();
    } else if (mediaElement.content.type === 'bar') {
      return renderBarChart();
    }
    return null;
  };

  const renderPieChart = () => {
    const data = mediaElement.content.data;
    const total = data.datasets[0].data.reduce((sum: number, value: number) => sum + value, 0);
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2 text-blue-600" />
          {mediaElement.title}
        </h3>
        <div className="flex items-center justify-center space-x-8">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
              {data.datasets[0].data.map((value: number, index: number) => {
                const percentage = (value / total) * 100;
                const strokeDasharray = `${percentage * 2.51} 251.2`;
                const strokeDashoffset = -index * 2.51 * (data.datasets[0].data.slice(0, index).reduce((sum: number, v: number) => sum + v, 0) / total * 100);
                
                return (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="40"
                    fill="none"
                    stroke={data.datasets[0].backgroundColor[index]}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-in-out"
                  />
                );
              })}
            </svg>
          </div>
          <div className="space-y-3">
            {data.labels.map((label: string, index: number) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-3" 
                  style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                />
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm text-gray-600 ml-2">({data.datasets[0].data[index]}%)</span>
              </div>
            ))}
          </div>
        </div>
        {mediaElement.description && (
          <p className="text-sm text-gray-600 mt-4 text-center">{mediaElement.description}</p>
        )}
      </div>
    );
  };

  const renderBarChart = () => {
    const data = mediaElement.content.data;
    const maxValue = Math.max(...data.datasets[0].data);
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
          {mediaElement.title}
        </h3>
        <div className="flex justify-center items-end space-x-6 h-64">
          {data.labels.map((label: string, index: number) => {
            const height = (data.datasets[0].data[index] / maxValue) * 200;
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-sm font-semibold mb-2">{data.datasets[0].data[index]}%</div>
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-1000 ease-out"
                  style={{ width: '60px', height: `${height}px` }}
                />
                <div className="text-xs text-gray-600 mt-2 text-center max-w-16">{label}</div>
              </div>
            );
          })}
        </div>
        {mediaElement.description && (
          <p className="text-sm text-gray-600 mt-4 text-center">{mediaElement.description}</p>
        )}
      </div>
    );
  };

  const renderTable = () => {
    const { headers, rows } = mediaElement.content;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <Table className="w-5 h-5 mr-2 text-purple-600" />
            {mediaElement.title}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {headers.map((header: string, index: number) => (
                  <th key={index} className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell: string, cellIndex: number) => (
                    <td key={cellIndex} className="px-4 py-3 text-sm text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {mediaElement.description && (
          <div className="p-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600">{mediaElement.description}</p>
          </div>
        )}
      </div>
    );
  };

  const renderScenario = () => {
    const { narrative, metrics } = mediaElement.content;
    
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-green-800">
          <Users className="w-5 h-5 mr-2" />
          {mediaElement.title}
        </h3>
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed">{narrative}</p>
        </div>
        
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="text-sm font-semibold text-gray-700 mb-2">{metric.label}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-600">Before: {metric.before}</span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">After: {metric.after}</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-xs font-bold text-blue-600">{metric.improvement}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {mediaElement.description && (
          <p className="text-sm text-gray-600 mt-4 italic">{mediaElement.description}</p>
        )}
      </div>
    );
  };

  const renderInfographic = () => {
    const data = mediaElement.content.data;
    
    if (mediaElement.content.template === 'impact_infographic') {
      return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-xl font-bold text-center mb-6">{mediaElement.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{data.beneficiaries}</div>
              <div className="text-sm opacity-90">Beneficiaries Reached</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{data.timeline}</div>
              <div className="text-sm opacity-90">Project Duration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{data.sectors.length}</div>
              <div className="text-sm opacity-90">Sectors Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{data.regions.length}</div>
              <div className="text-sm opacity-90">Regions Covered</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <div className="text-sm opacity-90">Key Sectors: {data.sectors.join(', ')}</div>
            <div className="text-sm opacity-90 mt-1">Target Regions: {data.regions.join(', ')}</div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-gray-600" />
          {mediaElement.title}
        </h3>
        <div className="text-center text-gray-600">
          <p>Infographic content will be generated here</p>
        </div>
      </div>
    );
  };

  const renderVideo = () => {
    const { videoUrl, duration, description } = mediaElement.content;
    
    return (
      <div className="bg-black rounded-lg overflow-hidden shadow-lg">
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{mediaElement.title}</h3>
            <p className="text-sm opacity-75 mb-2">{description}</p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {duration}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Professional Quality</span>
            </div>
          </div>
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-gray-800 ml-1" />
            </div>
          </div>
        </div>
        
        {mediaElement.description && (
          <div className="p-4 bg-gray-800 text-white">
            <p className="text-sm">{mediaElement.description}</p>
          </div>
        )}
      </div>
    );
  };

  const renderInteractiveTimeline = () => {
    const { timeline } = mediaElement.content;
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          {mediaElement.title}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </h3>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
          
          <div className="space-y-6">
            {timeline.slice(0, isExpanded ? timeline.length : 3).map((item: any, index: number) => (
              <div key={index} className="relative flex items-start">
                {/* Timeline dot */}
                <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                  {item.year}
                </div>
                
                {/* Content */}
                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.event}</h4>
                  <p className="text-sm text-gray-600">{item.milestone}</p>
                </div>
              </div>
            ))}
          </div>
          
          {!isExpanded && timeline.length > 3 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Show {timeline.length - 3} more milestones
              </button>
            </div>
          )}
        </div>
        
        {mediaElement.description && (
          <p className="text-sm text-gray-600 mt-4 italic">{mediaElement.description}</p>
        )}
      </div>
    );
  };

  const renderMap = () => {
    const { regions, facilities, beneficiaries, coverage_area } = mediaElement.content;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            {mediaElement.title}
          </h3>
        </div>
        
        <div className="relative">
          {/* Map placeholder with interactive feel */}
          <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 relative overflow-hidden">
            {/* Geographic regions */}
            {regions.map((region: string, index: number) => (
              <div
                key={index}
                className={`absolute bg-green-400/60 rounded-lg p-2 cursor-pointer hover:bg-green-500/70 transition-colors ${
                  index === 0 ? 'top-4 left-4' : index === 1 ? 'top-8 right-8' : 'bottom-6 left-1/2 transform -translate-x-1/2'
                }`}
              >
                <div className="text-xs font-medium text-green-800">{region}</div>
                <div className="text-xs text-green-700">{Math.floor(beneficiaries / regions.length)} people</div>
              </div>
            ))}
            
            {/* Coverage indicators */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white/90 rounded-lg p-4 shadow-sm">
                <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-700">Interactive Coverage Map</div>
                <div className="text-xs text-gray-600">Click regions for details</div>
              </div>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="p-4 bg-gray-50 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{facilities}</div>
              <div className="text-xs text-gray-600">Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{beneficiaries.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Beneficiaries</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{coverage_area}</div>
              <div className="text-xs text-gray-600">Coverage</div>
            </div>
          </div>
        </div>
        
        {mediaElement.description && (
          <div className="p-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600">{mediaElement.description}</p>
          </div>
        )}
      </div>
    );
  };

  const renderImagePlaceholder = () => {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
        <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{mediaElement.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{mediaElement.description}</p>
        <div className="text-xs text-gray-500 bg-gray-200 rounded px-3 py-1 inline-block">
          AI-generated image will appear here
        </div>
      </div>
    );
  };

  const getContainerClasses = () => {
    const baseClasses = "mb-6";
    const positionClasses = {
      'inline': 'max-w-md mx-auto',
      'full-width': 'w-full',
      'sidebar': 'max-w-sm'
    };
    
    return `${baseClasses} ${positionClasses[mediaElement.position]} ${className}`;
  };

  const renderDocument = () => {
    const { documentType, pages, template } = mediaElement.content;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold">{mediaElement.title}</h3>
          </div>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {template || 'Professional'} Template
          </span>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[1, 2, 3, 4].map((page) => (
              <div key={page} className="aspect-[3/4] bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Page {page}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Preview Full Document
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPresentation = () => {
    const { slides, theme } = mediaElement.content;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-purple-600" />
            <h3 className="text-lg font-semibold">{mediaElement.title}</h3>
          </div>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            {slides || 12} Slides
          </span>
        </div>
        
        <div className="p-6">
          <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <Monitor className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-purple-800">Interactive Presentation</h4>
              <p className="text-sm text-purple-600">Professional slides with animations</p>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
              <Play className="w-4 h-4 mr-2" />
              Start Presentation
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const { metrics, charts } = mediaElement.content;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <BarChart className="w-5 h-5 mr-2 text-green-600" />
            {mediaElement.title}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {(metrics || [
              { label: 'Total Impact', value: '25,000+', change: '+15%' },
              { label: 'Projects Active', value: '12', change: '+3' },
              { label: 'Success Rate', value: '94%', change: '+2%' },
              { label: 'Communities', value: '45', change: '+8' }
            ]).map((metric: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                <div className="text-xs text-green-600 mt-1">{metric.change}</div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-blue-700">Impact Trends</div>
              </div>
            </div>
            <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-green-700">Resource Distribution</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const render3DModel = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <Box className="w-5 h-5 mr-2 text-orange-600" />
            {mediaElement.title}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Box className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-orange-800">3D Model Visualization</h4>
              <p className="text-sm text-orange-600">Interactive 3D representation</p>
              <button className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                View in 3D
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFlowchart = () => {
    const { nodes, connections } = mediaElement.content;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <GitBranch className="w-5 h-5 mr-2 text-indigo-600" />
            {mediaElement.title}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {(nodes || ['Project Initiation', 'Stakeholder Engagement', 'Implementation', 'Monitoring', 'Evaluation']).map((node: string, index: number) => (
              <div key={index} className="flex items-center">
                <div className="w-4 h-4 bg-indigo-600 rounded-full mr-4"></div>
                <div className="flex-1 bg-indigo-50 rounded-lg p-3">
                  <div className="font-medium text-indigo-900">{node}</div>
                </div>
                {index < 4 && <div className="w-6 h-0.5 bg-indigo-300 ml-2"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGanttChart = () => {
    const { tasks, duration } = mediaElement.content;
    
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-teal-600" />
            {mediaElement.title}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {(tasks || [
              { name: 'Project Planning', duration: 2, start: 0 },
              { name: 'Stakeholder Engagement', duration: 4, start: 1 },
              { name: 'Implementation Phase 1', duration: 6, start: 3 },
              { name: 'Monitoring & Evaluation', duration: 3, start: 8 }
            ]).map((task: any, index: number) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-700 mr-4">{task.name}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div 
                    className="bg-teal-500 h-4 rounded-full" 
                    style={{ 
                      width: `${(task.duration / 12) * 100}%`,
                      marginLeft: `${(task.start / 12) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-600 ml-4">{task.duration}mo</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={getContainerClasses()}>
      {mediaElement.type === 'chart' && renderChart()}
      {mediaElement.type === 'table' && renderTable()}
      {mediaElement.type === 'scenario' && renderScenario()}
      {mediaElement.type === 'infographic' && renderInfographic()}
      {mediaElement.type === 'image' && renderImagePlaceholder()}
      {mediaElement.type === 'video' && renderVideo()}
      {mediaElement.type === 'interactive' && renderInteractiveTimeline()}
      {mediaElement.type === 'timeline' && renderInteractiveTimeline()}
      {mediaElement.type === 'map' && renderMap()}
      {mediaElement.type === 'document' && renderDocument()}
      {mediaElement.type === 'presentation' && renderPresentation()}
      {mediaElement.type === 'dashboard' && renderDashboard()}
      {mediaElement.type === '3d_model' && render3DModel()}
      {mediaElement.type === 'flowchart' && renderFlowchart()}
      {mediaElement.type === 'gantt' && renderGanttChart()}
    </div>
  );
};

export default MediaElementRenderer;