using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SeQuiz.Models;
using System.Data.Entity;
using System.Net;
using System.Web.Mvc.Ajax;

namespace SeQuiz.Controllers
{
    public class HomeController : Controller
    {

        private QuizDBEntities db = new QuizDBEntities();
        List<Task> quiztasks = new List<Task>();
        List<int> questionstoload = new List<int>();
        Random random = new Random();

        public ActionResult Index()
        {
            Quiz model = new Quiz();

            if (model.CurrentTask == null)
            {
            ImageSet demoSet = new ImageSet();
            demoSet.ImageName = "number";
            demoSet.ImageOrder = "3421";
            Task demo = new Task();
            demo.Instruction = "Click and drag a picture on top of another to swap thier places";
            model.CurrentTask = demo;
            model.CurrentImageset = demoSet;
            model.Score = 0;
            }

            Session["quiz"] = model;

            return View(model);
        }

      
                [HttpGet]
        public ActionResult StartQuiz()
        {
            Quiz model = new Quiz();


            
            quiztasks.Clear();
            //collection of model
            var tasks = from s in db.Tasks
                        select s;
            int rannum;
            int totalImageCount = 0;


            while (totalImageCount < 4)
            {
                rannum = random.Next(1, tasks.Count() + 1);
                if (!questionstoload.Contains(rannum))
                {
                    quiztasks.Add(tasks.First(x => x.Task_ID == rannum));
                    questionstoload.Add(rannum);

                    foreach (ImageSet imgs in quiztasks.Last().ImageSets)
                    {
                        totalImageCount++;
                    }
                }

            }

            model.Tasks = quiztasks;
            model.CurrentTask = model.Tasks.First();
            rannum = random.Next(0, model.CurrentTask.ImageSets.Count());
            model.CurrentImageset = model.Tasks.First().ImageSets.ElementAt(rannum);
            model.Finish = "Next"; 


            Session["quiz"] = model;

            if (Request.IsAjaxRequest())
            {
                return PartialView("QuizTasks", model);
            }
            else
            {
                return null;
            }
        }

        [HttpGet]
        public ActionResult NextQuestion(bool match,int minute, int secound)
        {
            Quiz model = new Quiz();

            if (Session["quiz"] != null)
            {
                model = (Quiz)Session["quiz"];
            }

            if (match)
            {
                model.Score = model.Score + model.CurrentTask.Points;

            }

                model.ImageCount++;
                if (model.ImageCount > model.CurrentTask.ImageSets.Count() - 1)
                {
                    model.ImageCount = 0;
                    model.TaskCount++;
          
                }
            model.RemainingMinutes = minute;
            model.RemainingSecounds = secound;

            if (model.TaskCount < model.Tasks.Count())
            {
                model.CurrentTask = model.Tasks.ElementAt(model.TaskCount);
                model.CurrentImageset = model.Tasks.ElementAt(model.TaskCount).ImageSets.ElementAt(model.ImageCount);
                if (model.TaskCount == model.Tasks.Count() - 1 && model.ImageCount == model.CurrentTask.ImageSets.Count() - 1)
                { model.Finish = "Finish"; }

                Session["quiz"] = model;

                        if (Request.IsAjaxRequest())
            {
                return PartialView("QuizTasks", model);

            }
            else
            {
                return null;
            }
            
            }
            else
            {
                Session["quiz"] = model;

                return RedirectToAction("ScoresOnBoard");
            }


        }


        public ActionResult ScoresOnBoard()
        {
            Quiz model = new Quiz();
            List<ScoreBoard> scoreboard = new List<ScoreBoard>();
            if (Session["quiz"] != null)
            {
                model = (Quiz)Session["quiz"];
            }
            var scores = from s in db.ScoreBoards
                         orderby s.Score descending
                         select s;
            scoreboard = scores.Take(10).ToList();
            model.LeaderBoard = scoreboard;
            foreach (ScoreBoard score in scoreboard)
            {
                if (score.Score < model.Score || scoreboard.Count < 10)
                {
                    model.NewHigh = true;
                }
            }
            ScoreBoard scoreentry = new ScoreBoard();
            double points = model.Score + (model.Score*((model.RemainingSecounds * 0.024) + model.RemainingMinutes * 1.5));
            scoreentry.Score = Convert.ToInt32(points);
            model.ScoreEntry = scoreentry;
            return View(model);

        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult ScoresOnBoard(Quiz scoreboard)

        {
            List<ScoreBoard> leaderboard = new List<ScoreBoard>();

      


            if (ModelState.IsValid)
            {
                db.ScoreBoards.Add(scoreboard.ScoreEntry);
                db.SaveChanges();
                var scores = from s in db.ScoreBoards
                             orderby s.Score descending
                             select s;
                leaderboard = scores.Take(10).ToList();
                scoreboard.LeaderBoard = leaderboard;
                return View(scoreboard); 
            }
            scoreboard = (Quiz)Session["quiz"];
            return View(scoreboard);

        }


    


	}




}